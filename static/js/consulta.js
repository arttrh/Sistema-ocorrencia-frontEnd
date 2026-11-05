document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("resultado-card");
  const recurso = document.body.dataset.recurso;
  const rotas = {
    aluno: "/aluno/",
    turma: "/turmas/detalhar/",
    usuario: "/usuario/",
    ocorrencia: "/ocorrencias/",
  };
  const campos = {
    id: "ID",
    name: "Nome",
    email: "E-mail",
    perfil: "Perfil",
    usuarioEnum: "Situação",
    dateBirth: "Nascimento",
    alunoEnum: "Situação",
    className: "Turma",
    turnoTurma: "Turno",
    classYear: "Ano",
    semestry: "Semestre",
    turmaEnum: "Situação",
    student: "Aluno",
    schoolClass: "Turma",
    category: "Categoria",
    type: "Tipo",
    date: "Data",
    time: "Horário",
    descriptionOccurrence: "Descrição",
    status: "Situação",
  };
  document.getElementById("btn-buscar").addEventListener("click", async () => {
    card.replaceChildren();
    try {
      const id = document.getElementById("input-id").value;
      if (!/^[1-9]\d*$/.test(id)) throw new Error("Informe um ID válido.");
      const item = await apiJson(rotas[recurso] + id);
      for (const [key, label] of Object.entries(campos))
        if (item[key] != null) {
          const p = document.createElement("p");
          p.textContent = `${label}: ${item[key]}`;
          card.append(p);
        }
      if (document.body.dataset.excluir) {
        const button = document.createElement("button");
        button.textContent = "Confirmar inativação";
        button.onclick = async () => {
          try {
            const caminho = {
              aluno: `/aluno/delete/${id}`,
              turma: `/turmas/excluir/${id}`,
              usuario: `/usuario/delete/${id}`,
              ocorrencia: `/ocorrencias/${id}`,
            };
            await apiJson(caminho[recurso], { method: "DELETE" });
            card.textContent = "Registro inativado.";
          } catch (error) {
            card.textContent = error.message;
          }
        };
        card.append(button);
      }
    } catch (error) {
      card.textContent = error.message;
    }
  });
});
