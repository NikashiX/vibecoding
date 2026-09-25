import { useState } from 'react';

export default function ParticipantsPage({ users }) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('todos');
  const roles = [...new Set(users.map((person) => person.role))];
  const normalizedQuery = query.toLowerCase();
  const filteredUsers = users.filter((person) => {
    const matchesRole = role === 'todos' || person.role === role;
    const matchesQuery = `${person.name} ${person.username}`
      .toLowerCase()
      .includes(normalizedQuery);

    return matchesRole && matchesQuery;
  });

  const administrators = users.filter((person) =>
    person.role.toLowerCase().includes('admin'),
  ).length;
  const analysts = users.filter((person) =>
    person.role.toLowerCase().includes('analista'),
  ).length;

  return (
    <section className="page-stack">
      <div className="stats">
        <article>
          <span className="stat-label">TOTAL DE PARTICIPANTES</span>
          <strong>{users.length}</strong>
          <small>contas cadastradas</small>
        </article>
        <article>
          <span className="stat-label">ADMINISTRADORES</span>
          <strong>{administrators}</strong>
          <small>acesso administrativo</small>
        </article>
        <article>
          <span className="stat-label">ANALISTAS</span>
          <strong>{analysts}</strong>
          <small>acesso de laboratório</small>
        </article>
      </div>

      <article className="panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">CONTAS CADASTRADAS</p>
            <h2>Todos os participantes</h2>
          </div>
          <span className="count-pill">
            {filteredUsers.length} de {users.length}
          </span>
        </div>

        <div className="toolbar">
          <input
            aria-label="Buscar participante"
            placeholder="Buscar por nome ou identificador…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filtrar por perfil"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="todos">Todos os perfis</option>
            {roles.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>NOME</th>
                <th>IDENTIFICADOR</th>
                <th>PERFIL</th>
                <th>CADASTRO</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((person) => (
                <tr key={person.username}>
                  <td><strong>{person.name}</strong></td>
                  <td className="mono muted">@{person.username}</td>
                  <td><span className="role-pill">{person.role}</span></td>
                  <td className="mono muted">{person.created_at.slice(0, 10)}</td>
                  <td><span className="status-tag"><i /> ativo</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <p className="empty-state">Nenhum participante encontrado.</p>
          )}
        </div>
      </article>

      <p className="simulation-note">
        Lista demonstrativa baseada nas contas do banco local deste laboratório.
      </p>
    </section>
  );
}
