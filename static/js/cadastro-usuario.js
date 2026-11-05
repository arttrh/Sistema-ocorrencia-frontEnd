document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagem-retorno");
  const campo = (id) => document.getElementById(id).value.trim();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    try {
      await apiJson("/usuario/cadastrar", {
        method: "POST",
        body: JSON.stringify({
          name: campo("name"),
          email: campo("login"),
          password: document.getElementById("password").value,
          perfil: campo("role"),
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
  preencherSelect("role", "/usuario/perfis").catch(
    (error) => (mensagem.textContent = error.message),
  );
});
