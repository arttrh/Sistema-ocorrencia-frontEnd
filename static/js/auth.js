/**
 * Sessao e chamadas autenticadas.
 *
 * Carregado antes dos scripts de pagina em todos os templates. Faz duas coisas:
 *  - garante que existe um token antes de renderizar uma pagina interna;
 *  - expoe apiFetch, o unico ponto por onde a aplicacao fala com o back-end.
 */
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("[Auth] Sem token — redirecionando para login.");
    window.location.href = "/index.html?error=unauthorized";
    return;
  }

  document.getElementById("btn-home")?.addEventListener("click", () => {
    window.location.href = "home.html";
  });

  document.getElementById("btn-backward")?.addEventListener("click", () => {
    window.history.back();
  });

  document.getElementById("btn-logout")?.addEventListener("click", () => {
    encerrarSessao("/index.html?logout=true");
  });
});

/** Limpa a sessao sem apagar preferencias locais como a URL da API. */
function encerrarSessao(destino) {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  localStorage.removeItem("id");
  window.location.href = destino;
}

/** Dados do usuario autenticado, ou null se a sessao nao estiver montada. */
function usuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "null");
  } catch (e) {
    return null;
  }
}

/**
 * Le a mensagem de erro que o back-end devolve.
 *
 * A API responde sempre no mesmo formato
 * ({ timestamp, status, error, message, path, fields }), entao o tratamento de
 * erro nao precisa mais adivinhar se veio texto puro ou JSON.
 */
async function mensagemDeErro(response) {
  const texto = await response.text();
  if (!texto) return `Erro ${response.status}`;

  try {
    const corpo = JSON.parse(texto);
    if (Array.isArray(corpo.fields) && corpo.fields.length > 0) {
      return corpo.fields.map((c) => `${c.field}: ${c.message}`).join("; ");
    }
    return corpo.message || corpo.error || texto;
  } catch (e) {
    return texto;
  }
}

/**
 * Wrapper das chamadas autenticadas a API.
 *
 * @param {string} caminho caminho relativo da API (ex.: "/incidents?page=0")
 * @param {object} opcoes  opcoes do fetch; o Authorization e' preenchido aqui
 * @returns {Promise<Response>}
 */
async function apiFetch(caminho, opcoes = {}) {
  const token = localStorage.getItem("token");
  const url = window.API_CONFIG.url(caminho);

  const config = {
    ...opcoes,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opcoes.headers || {}),
    },
  };

  // Em multipart o navegador precisa definir o Content-Type sozinho, porque so'
  // ele sabe o boundary que vai usar.
  if (opcoes.body && !(opcoes.body instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (erroDeRede) {
    console.error(`[apiFetch] Falha de rede em ${url}`, erroDeRede);
    throw new Error(
      "Nao foi possivel falar com o servidor. Verifique se o back-end esta no ar."
    );
  }

  if (response.status === 401) {
    console.warn("[apiFetch] 401 — sessao expirada.");
    encerrarSessao("/index.html?error=unauthorized");
    return Promise.reject(new Error("Sessao expirada"));
  }

  if (response.status === 403) {
    console.warn("[apiFetch] 403 — perfil sem permissao.");
    window.location.href = "acesso-negado.html";
    return Promise.reject(new Error("Acesso negado"));
  }

  if (response.status === 429) {
    const esperar = response.headers.get("Retry-After") || "alguns";
    throw new Error(
      `Muitas requisicoes. Tente novamente em ${esperar} segundos.`
    );
  }

  return response;
}

/** apiFetch que ja devolve o JSON e lanca erro com a mensagem do servidor. */
async function apiJson(caminho, opcoes = {}) {
  const response = await apiFetch(caminho, opcoes);
  if (!response.ok) {
    throw new Error(await mensagemDeErro(response));
  }
  return response.status === 204 ? null : response.json();
}
