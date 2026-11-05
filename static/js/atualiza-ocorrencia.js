document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-atualiza-ocorrencia");
  const mensagem = document.getElementById("mensagem-retorno");
  const campo = (id) => document.getElementById(id).value.trim();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    try {
      const dateTime = campo("register-date");
      const payload = {
        studentId: Number(campo("id-student")),
        classId: Number(campo("id-schoolclass")),
        categoryId: Number(campo("category")),
        occurenceId: Number(campo("type")),
        date: dateTime.slice(0, 10),
        time: dateTime.slice(11, 16) + ":00",
        descriptionOccurrence: campo("description"),
      };
      await apiJson(`/ocorrencias/${campo("id")}`, {
        method: "PUT",
        body: JSON.stringify(payload),
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
  preencherSelect(
    "category",
    "/ocorrencias/categorias",
    "id",
    "nameCategory",
  ).catch((error) => (mensagem.textContent = error.message));
  document
    .getElementById("category")
    .addEventListener("change", () =>
      preencherSelect(
        "type",
        `/ocorrencias/categorias/${campo("category")}/tipos`,
        "id",
        "nameOccurrence",
      ).catch((error) => (mensagem.textContent = error.message)),
    );
});
