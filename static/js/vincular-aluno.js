document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("form-vincular")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const mensagem = document.getElementById("mensagem-retorno");
      try {
        const turmaId = document.getElementById("turma-id").value;
        await apiJson(`/turmas/vincular/aluno/${turmaId}`, {
          method: "POST",
          body: JSON.stringify({
            studentId: Number(document.getElementById("aluno-id").value),
          }),
        });
        mensagem.textContent = "Aluno vinculado à turma.";
      } catch (error) {
        mensagem.textContent = error.message;
      }
    });
});
