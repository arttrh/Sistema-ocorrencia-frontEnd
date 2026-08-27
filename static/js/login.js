/**
 * Tela de login.
 *
 * O contrato com o back-end e': envia { login, password } e recebe
 * { tokenJWT, id, login, role }.
 */
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);

  const erroLogin = document.getElementById("erro-login");
  const logoutOk = document.getElementById("logout-ok");

  if (params.has("error") && erroLogin) {
    erroLogin.textContent =
      params.get("error") === "unauthorized"
        ? "Sua sessao expirou. Entre novamente."
        : "Usuario ou senha invalidos.";
    erroLogin.style.display = "block";
  }
  if (params.has("logout") && logoutOk) logoutOk.style.display = "block";
  if (params.has("passwordChanged") && logoutOk) {
    logoutOk.textContent = "Senha alterada. Entre com a nova senha.";
    logoutOk.style.display = "block";
  }

  const form = document.getElementById("login-form");
  if (!form) return;

  const botao = form.querySelector('button[type="submit"], input[type="submit"]');

  function mostrarErro(mensagem) {
    if (!erroLogin) return;
    erroLogin.textContent = mensagem;
    erroLogin.style.display = "block";
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value;

    if (erroLogin) erroLogin.style.display = "none";
    if (logoutOk) logoutOk.style.display = "none";

    if (!login || !password) {
      mostrarErro("Preencha usuario e senha.");
      return;
    }

    // Evita disparar varias tentativas com um duplo clique — que gastariam o
    // limite de tentativas do servidor a toa.
    if (botao) botao.disabled = true;

    try {
      const response = await fetch(window.API_CONFIG.url("/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (response.status === 429) {
        const espera = response.headers.get("Retry-After") || "alguns";
        mostrarErro(
          `Muitas tentativas. Aguarde ${espera} segundos e tente de novo.`
        );
        return;
      }

      if (!response.ok) {
        mostrarErro("Usuario ou senha invalidos.");
        return;
      }

      const data = await response.json();

      if (!data.tokenJWT) {
        mostrarErro("Resposta inesperada do servidor.");
        return;
      }

      localStorage.setItem("token", data.tokenJWT);
      localStorage.setItem(
        "usuario",
        JSON.stringify({ id: data.id, login: data.login, role: data.role })
      );

      window.location.href = "/templates/home.html";
    } catch (error) {
      console.error("[Login] Falha ao autenticar:", error);
      mostrarErro(
        "Nao foi possivel falar com o servidor. Verifique se o back-end esta no ar."
      );
    } finally {
      if (botao) botao.disabled = false;
    }
  });
});
