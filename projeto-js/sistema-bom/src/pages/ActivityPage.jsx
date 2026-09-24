import { useState } from 'react';
import { activityEvents } from '../data/activityEvents.js';

export default function ActivityPage({ user }) {
  const [filter, setFilter] = useState('todos');
  const categories = [...new Set(activityEvents.map((event) => event.type))];
  const filteredEvents = activityEvents.filter(
    (event) => filter === 'todos' || event.type === filter,
  );

  return (
    <section className="page-stack">
      <div className="activity-summary">
        <div>
          <span className="stat-label">EVENTOS NA SIMULAÇÃO</span>
          <strong>{activityEvents.length}</strong>
          <small>linha do tempo demonstrativa</small>
        </div>
        <label>
          Categoria
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="todos">Todas</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>

      <article className="panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">TRILHA DE AUDITORIA</p>
            <h2>Atividade recente</h2>
          </div>
          <span className="simulation-badge">SIMULADA</span>
        </div>

        <div className="timeline">
          {filteredEvents.map((event, index) => (
            <div className="timeline-item" key={event.title}>
              <span className={`timeline-marker ${event.tone}`} />
              <div className="timeline-copy">
                <div className="timeline-heading">
                  <strong>{event.title}</strong>
                  <span>{event.type}</span>
                </div>
                <p>
                  {event.detail}
                  {index === 0 ? ` Usuário: ${user.username}.` : ''}
                </p>
              </div>
              <time>{event.time}</time>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <p className="empty-state">Não há eventos nesta categoria.</p>
        )}
      </article>

      <p className="simulation-note">
        Eventos fictícios para demonstração. Nenhuma atividade é gravada no servidor.
      </p>
    </section>
  );
}
