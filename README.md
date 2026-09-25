# Vibe Security Lab — React + Node.js

Reimplementação do laboratório PHP em duas aplicações independentes:

- `sistema-ruim`: exemplo propositalmente vulnerável a SQL Injection, apenas para uso local.
- `sistema-bom`: versão corrigida com query parametrizada, bcrypt, sessão persistida, rate limit, Helmet e validação.

## Deploy no Dockploy

Use `compose.yaml` como arquivo Compose e a raiz do repositorio como build context. O Compose constroi e executa os dois sistemas nas portas 3001 (ruim) e 3002 (bom), com volumes persistentes separados para os bancos SQLite.

Cadastre no ambiente do servico `sistema-bom` as variaveis `SESSION_SECRET` (um segredo aleatorio longo) e `CAT_API_KEY` (sua chave da TheCatAPI). Nao coloque esses valores no Compose nem no repositorio. O Compose exige ambas as variaveis na hora do deploy. No Dockploy, configure os dominios encaminhando para `sistema-ruim:3001` e `sistema-bom:3002`.

As portas publicadas podem ser alteradas com `SISTEMA_RUIM_PORT` e `SISTEMA_BOM_PORT`. O sistema ruim e intencionalmente vulneravel e deve ser publicado somente em ambiente de demonstracao controlado.

## Como executar

É necessário Node.js 20 ou superior. Na raiz do repositorio, instale tudo:

```bash
npm run install:all
```

Em dois terminais, execute:

```bash
npm run dev:ruim
npm run dev:bom
```

Acesse `http://localhost:5173` (ruim) e `http://localhost:5174` (bom). Em ambas, o login de demonstração é `marina` / `vibe2026`.

Os bancos SQLite são criados em `sistema-ruim/data` e `sistema-bom/data`. A população do IBGE é buscada pelo backend; se a API estiver indisponível, a interface continua funcionando.

> Nunca publique o sistema ruim. Ele concatena dados do usuário no SQL deliberadamente para demonstrar a falha do projeto original.
