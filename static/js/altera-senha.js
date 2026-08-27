/**
 * Troca da propria senha.
 *
 * O back-end so' aceita a troca quando o id do corpo e' o do usuario autenticado
 * (ou quando quem chama e' ADMIN), entao o id vem do que o login guardou.
 */
document.addEventListener("DOMContentLoaded", () => {
  const usuario = usuarioLogado();
  const userId = usuario?.id;

  if (!userId) {
    alert("Sessao expirada. Faca login novamente.");
    window.location.href = "/index.html?error=unauthorized";
    return;
  }

  const form = document.getElementById("form-alterar-senha");
  const mensagem = document.getElementById("mensagem-retorno");
  if (!form || !mensagem) return;

  const exibirMensagem = (texto, tipo = "") => {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const oldPwd = document.getElementById("oldPassword").value.trim();
    const newPwd = document.getElementById("newPassword").value.trim();
    const confirmPwd = document.getElementById("confirmPassword").value.trim();

    if (!oldPwd || !newPwd || !confirmPwd) {
      exibirMensagem("Preencha todos os campos de senha.", "erro");
      return;
    }

    if (newPwd.length < 6) {
      exibirMensagem("A nova senha deve ter pelo menos 6 caracteres.", "erro");
      return;
    }

    if (newPwd !== confirmPwd) {
      exibirMensagem("As senhas novas não coincidem.", "erro");
      return;
    }

    try {
      const response = await apiFetch("/users/password", {
        method: "PATCH",
        body: JSON.stringify({
          id: userId,
          oldPassword: oldPwd,
          newPassword: newPwd,
        }),
      });

      if (!response.ok) {
        exibirMensagem(
          "Erro ao alterar senha: " + (await mensagemDeErro(response)),
          "erro"
        );
        return;
      }

      exibirMensagem(
        "Senha alterada com sucesso! Redirecionando...",
        "sucesso"
      );
      form.reset();
      // A senha mudou: a sessao atual deixa de fazer sentido.
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      setTimeout(() => {
        window.location.href = "/index.html?passwordChanged=true";
      }, 2000);
    } catch (error) {
      console.error("[Senha] Erro ao alterar:", error);
      exibirMensagem(error.message || "Falha na comunicacao com o servidor.", "erro");
    }
  });
});