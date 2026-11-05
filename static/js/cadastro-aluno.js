document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagem-retorno");
  const campo = (id) => document.getElementById(id).value.trim();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    try {
      await apiJson("/aluno/cadastrar", {
        method: "POST",
        body: JSON.stringify({
          name: campo("name"),
          photo: "/static/images/user-default.png",
          dateBirth: dataBrasileira(campo("birth-date")),
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
