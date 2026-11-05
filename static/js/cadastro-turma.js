document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagem-retorno");
  const campo = (id) => document.getElementById(id).value.trim();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    try {
      const year = campo("year");
      await apiJson("/turmas/cadastrar", {
        method: "POST",
        body: JSON.stringify({
          className: campo("name"),
          turmaTurno: campo("shift"),
          classYear: `${year}-01-01T00:00:00`,
          semestry: `${year}-${campo("semester") === "SEGUNDO" ? "07" : "01"}-01T00:00:00`,
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
  preencherSelect("shift", "/turmas/turnos").catch(
    (error) => (mensagem.textContent = error.message),
  );
  preencherSelect("semester", "/turmas/semestres").catch(
    (error) => (mensagem.textContent = error.message),
  );
});
