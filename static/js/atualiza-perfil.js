document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-atualizar");
  const mensagem = document.getElementById("mensagem-retorno");
  const campo = (id) => document.getElementById(id).value.trim();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    try {
      const id = campo("id");
      const usuario = await apiJson(`/usuario/${id}`);
      await apiJson(`/usuario/atualizar/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...usuario, perfil: campo("role") }),
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
  preencherSelect("role", "/usuario/perfis").catch(
    (error) => (mensagem.textContent = error.message),
  );
});
