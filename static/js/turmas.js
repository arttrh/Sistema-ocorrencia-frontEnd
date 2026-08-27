/**
 * Menu de turmas.
 *
 * A checagem de sessao, o botao "voltar" e o logout ficam no auth.js. Antes cada
 * um destes menus repetia esse bloco e escrevia o objeto do usuario direto no
 * rotulo, o que mostrava o JSON cru na tela.
 */
document.addEventListener("DOMContentLoaded", function () {
  const usuario = usuarioLogado();

  const rotulo = document.getElementById("usuario-logado");
  if (rotulo) {
    rotulo.textContent = usuario?.login || "Usuario";
  }
});

function cadastrarTurma() {
  window.location.href = "cadastro-turma.html";
}

function listarTurmas() {
  window.location.href = "listagem-turmas.html";
}

function consultarTurma() {
  window.location.href = "consulta-turma.html";
}

function listarCanceladas() {
  window.location.href = "listagem-turmas-canceladas.html";
}

function atualizarTurma() {
  window.location.href = "atualiza-turma.html";
}

function cancelarTurma() {
  window.location.href = "inativa-turma.html";
}