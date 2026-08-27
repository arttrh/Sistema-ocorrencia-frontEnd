/**
 * Tela inicial.
 *
 * A checagem de token e o botao de logout ficam no auth.js, carregado antes
 * desta pagina: aqui so' resta mostrar quem esta logado e navegar.
 */
document.addEventListener("DOMContentLoaded", function () {
  const usuario = usuarioLogado();

  const rotulo = document.getElementById("usuario-logado");
  if (rotulo) {
    rotulo.textContent = usuario?.login || "Usuario";
  }
});

function navigateTo(page) {
  window.location.href = page;
}
