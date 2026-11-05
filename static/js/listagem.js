document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.querySelector("table[data-url]");
  const tbody = tabela.querySelector("tbody");
  const colunas = tabela.dataset.colunas.split(",");
  const ordem = document.getElementById("select-ordenacao");
  const mensagem =
    document.getElementById("mensagem-retorno") ||
    document.getElementById("mensagem");
  const prev = document.getElementById("btn-prev"),
    next = document.getElementById("btn-next");
  async function carregar(pagina = 0) {
    try {
      const url = new URL(tabela.dataset.url, location.origin);
      url.searchParams.set("page", pagina);
      url.searchParams.set("size", "10");
      url.searchParams.set("sort", ordem?.value || "id");
      const data = await apiJson(url.pathname + url.search);
      tbody.replaceChildren();
      for (const item of data.content) {
        const row = tbody.insertRow();
        for (const campo of colunas) {
          const cell = row.insertCell();
          if (campo === "photo") {
            const img = document.createElement("img");
            img.src = item.photo;
            img.alt = `Foto de ${item.name}`;
            img.width = 40;
            cell.append(img);
          } else cell.textContent = item[campo] ?? "—";
        }
      }
      mensagem.textContent = data.totalElements
        ? `${data.totalElements} registro(s).`
        : "Nenhum registro encontrado.";
      document.getElementById("pagina-info").textContent =
        `Página ${data.number + 1} de ${Math.max(1, data.totalPages)}`;
      prev.disabled = data.first;
      next.disabled = data.last;
      prev.onclick = () => carregar(data.number - 1);
      next.onclick = () => carregar(data.number + 1);
    } catch (error) {
      tbody.replaceChildren();
      mensagem.textContent = error.message;
    }
  }
  ordem?.addEventListener("change", () => carregar());
  carregar();
});
