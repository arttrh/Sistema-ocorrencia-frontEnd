/**
 * Menu de ocorrencias.
 *
 * A versao anterior escrevia o objeto do usuario direto no rotulo, o que exibia
 * o JSON cru na tela; e repetia a checagem de token que o auth.js ja faz.
 */
document.addEventListener("DOMContentLoaded", function () {
  const usuario = usuarioLogado();

  const rotulo = document.getElementById("usuario-logado");
  if (rotulo) {
    rotulo.textContent = usuario?.login || "Usuario";
  }
});

function dashboardOcorrencia() {
  window.location.href = "dashboard-ocorrencias.html";
}

function cadastrarOcorrencia() {
  window.location.href = "cadastro-ocorrencia.html";
}

function listarTodasOcorrencias() {
  window.location.href = "listagem-ocorrencias.html";
}

function listarAguardandoAtendimento() {
  window.location.href = "listagem-ocorrencias-aguardando.html";
}

function listarEmAtendimento() {
  window.location.href = "listagem-ocorrencias-atendendo.html";
}

function listarAtivas() {
  window.location.href = "listagem-ocorrencias-ativas.html";
}

function listarResolvidas() {
  window.location.href = "listagem-ocorrencias-resolvidas.html";
}

function listarEncerradasSemSolucao() {
  window.location.href = "listagem-ocorrencias-nao-resolvidas.html";
}

function listarFechadas() {
  window.location.href = "listagem-ocorrencias-fechadas.html";
}

function atualizarOcorrencia() {
  window.location.href = "atualiza-ocorrencia.html";
}

function alterarStatusOcorrencia() {
  window.location.href = "atualiza-status.html";
}

function excluirOcorrencia() {
  window.location.href = "inativa-ocorrencia.html";
}
