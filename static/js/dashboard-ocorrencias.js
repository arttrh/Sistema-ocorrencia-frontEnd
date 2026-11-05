document.addEventListener("DOMContentLoaded", async () => {
  try {
    const resumo = await apiJson("/ocorrencias/resumo");
    const campos = {
      "card-ativas": "ATIVAS",
      "card-aguardando": "AGUARDANDO",
      "card-atendimento": "ATENDENDO",
      "card-resolvidas": "RESOLVIDAS",
      "card-encerradas": "NAO_RESOLVIDAS",
      "card-fechadas": "FECHADAS",
    };
    for (const [id, status] of Object.entries(campos)) {
      const el = document.getElementById(id);
      el.textContent = el.textContent.split(":")[0] + ": " + resumo[status];
    }
  } catch (error) {
    document.getElementById("mensagem-retorno").textContent = error.message;
  }
});
