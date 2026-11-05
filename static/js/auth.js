document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    location.href = "/index.html?error=unauthorized";
    return;
  }
  document
    .getElementById("btn-home")
    ?.addEventListener("click", () => (location.href = "/templates/home.html"));
  document
    .getElementById("btn-backward")
    ?.addEventListener("click", () => history.back());
  document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    location.href = "/index.html?logout=true";
  });
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const nome = document.getElementById("usuario-logado");
  if (nome) nome.textContent = usuario.email || "Usuário";
});
async function apiFetch(path, options = {}) {
  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...options.headers,
    },
  });
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    location.href = "/index.html?error=unauthorized";
    throw new Error("Sessão expirada. Entre novamente.");
  }
  return response;
}
async function apiJson(path, options) {
  const response = await apiFetch(path, options);
  if (response.status >= 500)
    throw new Error(
      "O servidor está iniciando ou indisponível. Aguarde um minuto e tente novamente.",
    );
  if (!response.ok)
    throw new Error(
      response.status === 403
        ? "Seu perfil não tem permissão para esta ação."
        : (await response.text()) || "Não foi possível concluir a ação.",
    );
  return response.status === 204 ? null : response.json();
}
function dataBrasileira(iso) {
  return iso?.slice(0, 10).split("-").reverse().join("/") || "";
}
async function preencherSelect(id, path, valor, rotulo) {
  const select = document.getElementById(id);
  select.replaceChildren(new Option("Selecione", ""));
  for (const item of await apiJson(path))
    select.add(
      new Option(rotulo ? item[rotulo] : item, valor ? item[valor] : item),
    );
}
