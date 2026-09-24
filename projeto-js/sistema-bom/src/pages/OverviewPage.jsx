import StatsCards from '../components/StatsCards.jsx';

export default function OverviewPage({ data, user }) {
  return (
    <>
      <StatsCards data={data} />

      <section className="content-grid">
        <article className="panel" id="users">
          <div className="panel-title">
            <div>
              <p className="eyebrow">DADOS PERSISTIDOS</p>
              <h2>Participantes do lab</h2>
            </div>
            <span className="count-pill">{data.users.length} registros</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>NOME</th>
                  <th>IDENTIFICADOR</th>
                  <th>PERFIL</th>
                  <th>ENTRADA</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((person) => (
                  <tr key={person.username}>
                    <td><strong>{person.name}</strong></td>
                    <td className="mono muted">@{person.username}</td>
                    <td><span className="role-pill">{person.role}</span></td>
                    <td className="mono muted">{person.created_at.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel" id="activity">
          <div className="panel-title">
            <div>
              <p className="eyebrow">TELEMETRIA</p>
              <h2>Atividade recente</h2>
            </div>
            <span className="live-dot">● AO VIVO</span>
          </div>
          <div className="activity-item">
            <span className="activity-marker green" />
            <div>
              <strong>Sessão iniciada</strong>
              <p>Login autorizado para {user.username}</p>
            </div>
            <time>agora</time>
          </div>
          <div className="activity-item">
            <span className="activity-marker" />
            <div>
              <strong>IBGE consultado</strong>
              <p>População estimada via API SIDRA</p>
            </div>
            <time>agora</time>
          </div>
        </article>
      </section>
    </>
  );
}
