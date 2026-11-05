document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-atualiza-aluno");
  const mensagem = document.getElementById("mensagem-retorno");
  const campo = (id) => document.getElementById(id).value.trim();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    try {
      const id = campo("id");
      const aluno = await apiJson(`/aluno/${id}`);
      await apiJson(`/aluno/atualizar/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          photo: aluno.photo,
          name: campo("name") || aluno.name,
          dateBirth: campo("birth-date")
            ? dataBrasileira(campo("birth-date"))
            : dataBrasileira(aluno.dateBirth),
        }),
      });
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
