# Vibe Security Lab

Laboratório local em PHP para demonstrar autenticação e uma falha de SQL Injection de forma controlada.

## Executar com Docker

Na pasta do projeto, execute:

```bash
docker compose up --build
```

Acesse `http://localhost:8081/` no navegador. Para encerrar:

```bash
docker compose down
```

Login normal: `marina` / `vibe2026`.

O banco SQLite é criado automaticamente e fica persistido no volume `vibe_data`. A consulta vulnerável está isolada em `index.php` e identificada com o comentário `LAB`; não reutilize esse padrão em produção.

## Comparar com a versão segura

A versão corrigida está em `secure/` e pode ser acessada em `http://localhost:8081/secure/`. Ela usa consulta preparada e armazena as senhas com hash.
