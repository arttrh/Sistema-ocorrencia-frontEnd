document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-alterar-senha");
  const mensagem = document.getElementById("mensagem-retorno");
  const campo = (id) => document.getElementById(id).value.trim();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    try {
      const senha = document.getElementById("newPassword").value;
      if (senha !== document.getElementById("confirmPassword").value)
        throw new Error("As senhas não coincidem.");
      await apiJson("/usuario/senha", {
        method: "PATCH",
        body: JSON.stringify({
          oldPassword: document.getElementById("oldPassword").value,
          newPassword: senha,
        }),
      });
      form.reset();
      mensagem.textContent = "Operação concluída com sucesso.";
      mensagem.className = "mensagem sucesso";
    } catch (error) {
      mensagem.textContent = error.message;
      mensagem.className = "mensagem erro";
    } finally {
      if (button) button.disabled = false;
    }
  });
});
