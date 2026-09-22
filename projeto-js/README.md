# Vibe Security Lab — React + Node.js

Reimplementação do laboratório PHP em duas aplicações independentes:

- `sistema-ruim`: exemplo propositalmente vulnerável a SQL Injection, apenas para uso local.
- `sistema-bom`: versão corrigida com query parametrizada, bcrypt, sessão persistida, rate limit, Helmet e validação.

## Como executar

É necessário Node.js 20 ou superior. Na pasta `projeto-js`, instale tudo:

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
