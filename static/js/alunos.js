/**
 * Menu de alunos.
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

function cadastrarAluno() {
  window.location.href = "cadastro-aluno.html";
}

function enviarFoto() {
  window.location.href = "upload-foto-aluno.html";
}

function listarAlunos() {
  window.location.href = "listagem-alunos.html";
}

function consultarAluno() {
  window.location.href = "consulta-aluno.html";
}

function atualizarAluno() {
  window.location.href = "atualiza-aluno.html";
}

function excluirAluno() {
  window.location.href = "inativa-aluno.html";
}