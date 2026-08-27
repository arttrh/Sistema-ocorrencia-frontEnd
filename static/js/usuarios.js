/**
 * Menu de usuarios.
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

function cadastrarUsuario() {
  window.location.href = "cadastro-usuario.html";
}

function alterarSenha() {
  window.location.href = "altera-senha.html";
}

function listarUsuarios() {
  window.location.href = "listagem-usuarios.html";
}

function consultarUsuario() {
  window.location.href = "consulta-usuario.html";
}

function atualizarPerfil() {
  window.location.href = "atualiza-perfil.html";
}

function atualizarUsuario() {
  window.location.href = "atualiza-usuario.html";
}

function excluirUsuario() {
  window.location.href = "inativa-usuario.html";
}