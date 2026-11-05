document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-atualiza-turma");
  const mensagem = document.getElementById("mensagem-retorno");
  const campo = (id) => document.getElementById(id).value.trim();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    try {
      const id = campo("id");
      const turma = await apiJson(`/turmas/detalhar/${id}`);
      await apiJson(`/turmas/atualizar/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          className: campo("name") || turma.className,
          turnoTurma: campo("shift") || turma.turnoTurma,
          classYear: turma.classYear,
          semestry: campo("semester")
            ? `${turma.classYear.slice(0, 4)}-${campo("semester") === "SEGUNDO" ? "07" : "01"}-01T00:00:00`
            : turma.semestry,
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
  preencherSelect("shift", "/turmas/turnos").catch(
    (error) => (mensagem.textContent = error.message),
  );
  preencherSelect("semester", "/turmas/semestres").catch(
    (error) => (mensagem.textContent = error.message),
  );
});
