import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import vm from "node:vm";

test("páginas usam scripts e links locais existentes", () => {
  const root = resolve(import.meta.dirname, "..");
  const files = [
    "index.html",
    ...readdirSync(resolve(root, "templates")).map(
      (file) => `templates/${file}`,
    ),
  ];
  for (const file of files) {
    const html = readFileSync(resolve(root, file), "utf8").replace(
      /<!--[\s\S]*?-->/g,
      "",
    );
    const scripts = [];
    for (const [, attribute, url] of html.matchAll(/(src|href)="([^"]+)"/g)) {
      if (!url || /^(https?:|#|data:)/.test(url)) continue;
      const path = url.startsWith("/")
        ? resolve(root, url.slice(1))
        : resolve(root, dirname(file), url);
      assert.ok(existsSync(path), `${file}: ${url}`);
      if (attribute === "src" && url.endsWith(".js")) scripts.push(url);
    }
    assert.equal(
      scripts.length,
      new Set(scripts).size,
      `${file}: script duplicado`,
    );
    if (file !== "index.html") {
      assert.ok(
        scripts.indexOf("/static/js/config.js") <
          scripts.indexOf("/static/js/auth.js"),
      );
    }
  }
});

test("API envia JWT e apresenta erro de permissão sem encerrar a sessão", async () => {
  let request;
  const context = vm.createContext({
    API_BASE_URL: "/api",
    document: { addEventListener() {} },
    localStorage: { getItem: () => "token-de-teste" },
    fetch: async (url, options) => {
      request = { url, options };
      return { status: 403, ok: false };
    },
  });
  vm.runInContext(
    readFileSync(resolve(import.meta.dirname, "../static/js/auth.js"), "utf8"),
    context,
  );
  await assert.rejects(
    vm.runInContext('apiJson("/usuario/ativos")', context),
    /permissão/,
  );
  assert.equal(request.url, "/api/usuario/ativos");
  assert.equal(request.options.headers.Authorization, "Bearer token-de-teste");
});

test("formulários contêm os campos usados por seus scripts", () => {
  const root = resolve(import.meta.dirname, "..");
  const shared = new Set([
    "auth.js",
    "config.js",
    "consulta.js",
    "listagem.js",
  ]);
  for (const file of readdirSync(resolve(root, "templates"))) {
    const html = readFileSync(resolve(root, "templates", file), "utf8");
    for (const [, script] of html.matchAll(/src="\/static\/js\/([^"]+)"/g)) {
      if (shared.has(script)) continue;
      const source = readFileSync(resolve(root, "static/js", script), "utf8");
      for (const [, id] of source.matchAll(
        /(?:getElementById|campo)\("([^"]+)"\)/g,
      )) {
        assert.ok(
          html.includes(`id="${id}"`),
          `${file}: campo ${id} não existe`,
        );
      }
    }
  }
});

test("falha do servidor é apresentada como indisponibilidade", async () => {
  const context = vm.createContext({
    API_BASE_URL: "/api",
    document: { addEventListener() {} },
    localStorage: { getItem: () => "token-de-teste" },
    fetch: async () => ({ status: 503, ok: false }),
  });
  vm.runInContext(
    readFileSync(resolve(import.meta.dirname, "../static/js/auth.js"), "utf8"),
    context,
  );
  await assert.rejects(
    vm.runInContext('apiJson("/ocorrencias")', context),
    /indisponível/,
  );
});
