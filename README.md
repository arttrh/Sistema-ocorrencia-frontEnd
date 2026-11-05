# Frontend de ocorrências escolares

HTML, CSS e JavaScript sem framework e sem etapa de build. Mantém páginas em `templates`, estilos em `static/css` e scripts em `static/js`.

`static/js/config.js` define `/api` como base. Na Vercel, configure uma rewrite de `/api/:path*` para a URL HTTPS do backend no Render. Não coloque senha ou segredo JWT neste repositório.

Entre com a conta criada pelo administrador. Para registrar uma ocorrência, primeiro cadastre aluno e turma e vincule-os na seção Turmas. Usuários comuns não podem cadastrar administradores; a API controla as permissões.

As listas e consultas compartilham scripts pequenos. Formulários mantêm arquivos próprios. A foto do aluno aceita PNG ou JPEG de até 150 KB e fica no campo já existente no banco. O painel mostra contagens reais por situação; erros não são apresentados como dados de exemplo.

## Verificação

Valide a sintaxe com `node --check static/js/ARQUIVO.js`. Para usar localmente, sirva os arquivos por HTTP e encaminhe `/api` ao backend, ou ajuste temporariamente a base da API e o CORS no seu ambiente.

Confira login, cadastro de aluno, cadastro de turma, vínculo, ocorrência e listagem. Verifique também erro de credenciais, falta de permissão e visualização em celular. Não há cadastro público nem recuperação de senha por e-mail implementados.
