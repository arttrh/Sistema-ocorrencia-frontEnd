document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastro-form");
  const mensagem = document.getElementById("erro-cadastro");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    const password = document.getElementById("password").value;
    mensagem.hidden = true;
    if (password !== document.getElementById("password-confirmation").value) {
      mensagem.textContent = "As senhas precisam ser iguais.";
      mensagem.hidden = false;
      return;
    }
    button.disabled = true;
    try {
      const response = await fetch(API_BASE_URL + "/usuario/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: document.getElementById("name").value.trim(),
          email: document.getElementById("email").value.trim(),
          password,
        }),
      });
      if (!response.ok)
        throw new Error(
          response.status === 400 || response.status === 409
            ? "Confira os dados ou use outro e-mail."
            : "O servidor está iniciando ou indisponível. Aguarde um minuto e tente novamente.",
        );
      location.href = "/index.html?cadastro=ok";
    } catch (error) {
      mensagem.textContent =
        error instanceof TypeError
          ? "Não foi possível acessar o servidor. Aguarde um minuto e tente novamente."
          : error.message;
      mensagem.hidden = false;
    } finally {
      button.disabled = false;
    }
  });
});
