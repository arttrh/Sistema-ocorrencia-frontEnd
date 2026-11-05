document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-upload-foto");
  const mensagem = document.getElementById("mensagem-retorno");
  const campo = (id) => document.getElementById(id).value.trim();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    try {
      const file = document.getElementById("image").files[0];
      if (
        !file ||
        !["image/png", "image/jpeg"].includes(file.type) ||
        file.size > 150000
      )
        throw new Error("Use PNG ou JPEG de até 150 KB.");
      const photo = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const id = campo("id");
      const aluno = await apiJson(`/aluno/${id}`);
      await apiJson(`/aluno/atualizar/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: aluno.name,
          dateBirth: dataBrasileira(aluno.dateBirth),
          photo,
        }),
      });
      document.getElementById("preview").src = photo;
      document.getElementById("preview").style.display = "block";
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
