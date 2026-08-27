# 🎨 Sistema de Ocorrência Escolar — Front-end

Interface web do [Sistema de Ocorrência Escolar](https://github.com/arttrh/Ocorrencia-escolar).
HTML, CSS e JavaScript puros, sem build e sem dependências de pacote.

---

## 🚀 Como rodar

Qualquer servidor de arquivos estáticos serve. Com o Live Server do VS Code,
abra `index.html` com **Go Live** (porta 5500). Ou:

```bash
python3 -m http.server 5500
```

E acesse `http://localhost:5500`.

> Abrir o HTML direto pelo `file://` funciona para ver o layout, mas o navegador
> bloqueia as chamadas à API por causa do CORS. Use um servidor local.

---

## ⚙️ Apontando para a API

A URL do back-end é resolvida em `static/js/config.js`, nesta ordem:

1. **`localStorage.apiBaseUrl`** — ajuste pontual na sua máquina:
   ```js
   localStorage.setItem("apiBaseUrl", "http://192.168.0.10:8080");
   ```
2. **Meta tag** — para fixar no deploy:
   ```html
   <meta name="api-base-url" content="https://api.suaescola.com.br" />
   ```
3. **Mesma origem da página** — quando front e back são servidos juntos.
4. **`http://localhost:8080`** — padrão do Spring Boot.

O back-end precisa liberar a origem do front em `APP_CORS_ALLOWED_ORIGINS`.

---

## 📁 Estrutura

```
.
├── index.html            Login
├── templates/            Telas internas
├── static/
│   ├── js/
│   │   ├── config.js     Resolve a URL da API           ← carrega primeiro
│   │   ├── auth.js       Sessão + apiFetch              ← carrega em seguida
│   │   └── *.js          Um script por tela
│   ├── css/
│   └── images/
```

Todo template carrega, nesta ordem: `config.js` → `auth.js` → o script da tela.

---

## 🔌 Falando com a API

Nenhuma tela chama `fetch` direto. O caminho é sempre `apiFetch`, definido em
`auth.js`:

```js
const resp = await apiFetch("/incidents?page=0&size=10");
if (!resp.ok) throw new Error(await mensagemDeErro(resp));
const dados = await resp.json();
```

`apiFetch` cuida de:

- montar a URL a partir da configuração;
- anexar o `Authorization: Bearer <token>`;
- definir `Content-Type: application/json` — **exceto** em `FormData`, onde o
  navegador precisa definir o cabeçalho sozinho por causa do *boundary*;
- **401** → limpa a sessão e volta ao login;
- **403** → leva para `acesso-negado.html`;
- **429** → erro legível com o tempo de espera do `Retry-After`;
- falha de rede → mensagem clara em vez de `TypeError: Failed to fetch`.

Atalho quando você só quer o JSON:

```js
const dados = await apiJson("/incidents/summary");
```

E `usuarioLogado()` devolve `{ id, login, role }` da sessão, ou `null`.

---

## 🗂️ Sessão

O login guarda no `localStorage`:

| Chave | Conteúdo |
|---|---|
| `token` | JWT devolvido pelo back-end |
| `usuario` | `{ id, login, role }` |
| `apiBaseUrl` | *(opcional)* sobrescreve a URL da API |

O logout remove `token` e `usuario` — e preserva `apiBaseUrl`, que é preferência
da máquina, não da sessão.

---

## 📄 Formatos de data

Os formulários enviam data no formato brasileiro, e a API aceita exatamente esses:

| Campo | Formato | Exemplo |
|---|---|---|
| `birthDate` (aluno) | `dd/MM/yyyy` | `27/03/2008` |
| `registerDate`, `updateDate` (ocorrência) | `dd/MM/yyyy - HH:mm` | `27/03/2026 - 14:30` |

---

## 📋 Telas

| Área | Telas |
|---|---|
| **Usuários** | cadastro, listagem, consulta, atualização, alteração de perfil, inativação, troca de senha |
| **Alunos** | cadastro, listagem, consulta, atualização, foto, inativação |
| **Turmas** | cadastro, listagem, canceladas, consulta, atualização, cancelamento |
| **Ocorrências** | cadastro, listagem geral e por situação, atualização, mudança de status, cancelamento, dashboard |
