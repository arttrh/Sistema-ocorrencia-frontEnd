document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const mensagem = document.getElementById("erro-login");
  if (new URLSearchParams(location.search).has("logout"))
    document.getElementById("logout-ok").hidden = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    button.disabled = true;
    mensagem.hidden = true;
    try {
      const email = document.getElementById("login").value.trim();
      const response = await fetch(API_BASE_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: document.getElementById("password").value,
        }),
      });
      if (!response.ok)
        throw new Error(
          response.status === 429
            ? "Muitas tentativas. Aguarde um minuto."
            : "Confira seu e-mail e senha.",
        );
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify({ email }));
      location.href = "/templates/home.html";
    } catch (error) {
      mensagem.textContent = error.message;
      mensagem.hidden = false;
    } finally {
      button.disabled = false;
    }
  });
});
