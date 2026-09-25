import { useEffect, useState } from 'react';
import './map.css';

async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Erro inesperado.');
  }

  return response.status === 204 ? null : response.json();
}

export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    api('/me')
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await api('/logout', { method: 'POST' });
    setUser(null);
  }

  if (user === undefined) {
    return <div className="loading">Carregando…</div>;
  }

  return user
    ? <Dashboard user={user} onLogout={handleLogout} />
    : <Login onLogin={setUser} />;
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const { user } = await api('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      onLogin(user);
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-intro">
        <Brand />
        <div className="intro-copy">
          <p className="eyebrow">AMBIENTE DE TREINAMENTO · 01</p>
          <h1>Observe.<br /><em>Teste.</em><br />Aprenda.</h1>
          <p>
            Um laboratório local para entender como pequenos detalhes no código
            podem mudar completamente o comportamento de um sistema.
          </p>
        </div>
        <div className="status-line">
          <span className="pulse" /> ambiente local vulnerável
          <span className="mono">127.0.0.1</span>
        </div>
      </section>

      <section className="login-card-wrap">
        <div className="login-card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">ACESSO AO PAINEL</p>
              <h2>Bem-vindo de volta.</h2>
            </div>
            <span className="lock-icon">⌁</span>
          </div>

          {error && <div className="alert" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Identificador</label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="ex.: marina"
              autoComplete="username"
              required
            />
            <label htmlFor="password">Chave de acesso</label>
            <input
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button type="submit">
              Entrar no laboratório <span>↗</span>
            </button>
          </form>

          <div className="demo-hint">
            <span>DEMO</span>
            <div>marina <b>/</b> vibe2026</div>
          </div>
          <p className="lab-note">Ambiente educacional propositalmente vulnerável.</p>
        </div>

        <div className="card-footer">
          <span>VIBE SECURITY LAB</span>
          <span>inseguro / v1.0.0</span>
        </div>
      </section>
    </main>
  );
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">VX</span>
      <span>VIBE / SECURITY LAB</span>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState('overview');

  useEffect(() => {
    api('/dashboard').then(setData);
  }, []);

  if (!data) {
    return <div className="loading">Carregando painel…</div>;
  }

  function navigate(event, nextPage) {
    event.preventDefault();
    setPage(nextPage);
  }

  const pageLabel = {
    overview: 'VISÃO GERAL',
    participants: 'PARTICIPANTES',
    activity: 'ATIVIDADE',
  }[page];
  const pageTitle = page === 'overview'
    ? `Olá, ${user.name.split(' ')[0]}.`
    : page === 'participants' ? 'Participantes' : 'Atividade do laboratório';

  return (
    <>
      <aside className="sidebar">
        <Brand />
        <nav aria-label="Navegação principal">
          <a href="#overview" className={page === 'overview' ? 'active' : ''} onClick={(event) => navigate(event, 'overview')}>
            ◈ Visão geral
          </a>
          <a href="#participants" className={page === 'participants' ? 'active' : ''} onClick={(event) => navigate(event, 'participants')}>
            ◌ Participantes
          </a>
          <a href="#activity" className={page === 'activity' ? 'active' : ''} onClick={(event) => navigate(event, 'activity')}>
            ↯ Atividade
          </a>
        </nav>
        <div className="side-bottom">
          <div className="side-status"><span className="pulse" /> sistema online</div>
          <button className="logout" onClick={onLogout}>Sair da conta <span>↗</span></button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">PAINEL DE CONTROLE / {pageLabel}</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="profile">
            <div className="avatar">{user.name[0]}</div>
            <div><strong>{user.name}</strong><small>{user.role}</small></div>
          </div>
        </header>

        {page === 'overview' && (
          <>
            <Stats data={data} />

            <section className="map-panel panel" aria-labelledby="brazil-map-title">
              <div className="map-copy">
                <p className="eyebrow">VISÃO TERRITORIAL</p>
                <h2 id="brazil-map-title">Brasil em foco</h2>
                <p className="map-description">
                  Referência geográfica para os dados nacionais apresentados no painel.
                </p>
                <div className="map-metric">
                  <span className="stat-label">POPULAÇÃO ESTIMADA</span>
                  <strong>{data.population?.value.toLocaleString('pt-BR') || '—'}</strong>
                  <small>Brasil · {data.population?.year || 'ano indisponível'} · IBGE</small>
                </div>
                <div className="map-legend">
                  <span><i className="map-legend-dot" /> capitais em destaque</span>
                  <span className="map-source">Mapa: Natural Earth · 1:110m</span>
                </div>
              </div>

              <div className="map-visual" role="img" aria-label="Mapa ilustrativo do Brasil com capitais em destaque">
                <svg viewBox="0 0 340 360" aria-hidden="true">
                  <defs>
                    <linearGradient id="brazil-map-fill-ruim" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#d7fa68" />
                      <stop offset="100%" stopColor="#a9d95f" />
                    </linearGradient>
                  </defs>
                  <path className="brazil-map-shape" d="M176.7 343.1 L173.5 328.7 L144.4 313.4 L174.6 285.9 L174.7 279.2 L167.1 276.0 L169.7 261.6 L161.3 261.1 L158.2 247.7 L142.0 245.5 L140.3 229.5 L145.3 212.8 L139.7 197.1 L125.1 196.8 L122.5 176.0 L85.3 157.6 L85.8 142.5 L63.5 153.0 L46.2 152.9 L46.7 140.2 L33.8 144.9 L25.9 140.0 L20.1 123.8 L28.4 105.0 L51.2 96.9 L54.8 70.3 L50.3 56.4 L56.3 52.7 L51.8 46.6 L69.1 43.9 L72.7 51.5 L84.2 54.4 L100.7 42.6 L93.9 40.1 L89.8 27.1 L102.8 29.4 L119.0 23.0 L120.8 17.5 L126.5 19.1 L129.8 27.9 L126.5 37.9 L133.7 49.9 L156.7 45.8 L156.9 40.0 L180.0 43.2 L192.3 25.8 L202.5 46.4 L199.3 61.6 L212.8 62.9 L213.0 71.3 L218.8 65.8 L241.0 73.9 L243.4 83.4 L278.4 85.0 L299.3 101.2 L311.7 104.0 L318.3 122.3 L315.2 136.1 L288.3 170.0 L283.8 210.2 L271.1 244.2 L263.1 252.9 L242.9 256.0 L220.1 268.9 L213.7 277.1 L210.7 300.5 L176.7 343.1 Z" />
                  <g className="map-capital" transform="translate(126 87)"><circle r="5" /><title>Manaus</title></g>
                  <g className="map-capital" transform="translate(213 73)"><circle r="4" /><title>Belém</title></g>
                  <g className="map-capital map-capital-main" transform="translate(218 193)"><circle r="6" /><title>Brasília</title></g>
                  <g className="map-capital" transform="translate(289 92)"><circle r="4" /><title>Fortaleza</title></g>
                  <g className="map-capital" transform="translate(290 169)"><circle r="4" /><title>Salvador</title></g>
                  <g className="map-capital" transform="translate(228 259)"><circle r="4" /><title>São Paulo</title></g>
                  <g className="map-capital" transform="translate(253 253)"><circle r="4" /><title>Rio de Janeiro</title></g>
                  <g className="map-capital" transform="translate(193 311)"><circle r="4" /><title>Porto Alegre</title></g>
                </svg>
                <span className="map-label map-label-north">N</span>
                <span className="map-label map-label-brasilia">BRASÍLIA</span>
              </div>
            </section>

            <OverviewContent data={data} user={user} />
          </>
        )}

        {page === 'participants' && <Participants data={data} />}
        {page === 'activity' && <ActivityPage user={user} />}

        <footer>
          <span>VIBE SECURITY LAB © 2026</span>
          <span>{page === 'overview' ? 'dados: IBGE / SIDRA' : 'simulação local'}</span>
        </footer>
      </main>
    </>
  );
}

function Stats({ data }) {
  return (
    <section className="stats">
      <article>
        <span className="stat-label">USUÁRIOS NO BANCO</span>
        <strong>{data.users.length}</strong>
        <small>desde a inicialização</small>
      </article>
      <article>
        <span className="stat-label">POPULAÇÃO DO BRASIL</span>
        <strong>{data.population?.value.toLocaleString('pt-BR') || '—'}</strong>
        <small><i>IBGE</i> estimativa {data.population?.year || 'indisponível'}</small>
      </article>
      <article>
        <span className="stat-label">STATUS DA SESSÃO</span>
        <strong className="green-text">ATIVA</strong>
        <small>autenticado agora</small>
      </article>
    </section>
  );
}

function OverviewContent({ data, user }) {
  return (
    <section className="content-grid">
      <article className="panel" id="users">
        <div className="panel-title">
          <div><p className="eyebrow">DADOS PERSISTIDOS</p><h2>Participantes do lab</h2></div>
          <span className="count-pill">{data.users.length} registros</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>NOME</th><th>IDENTIFICADOR</th><th>PERFIL</th><th>ENTRADA</th></tr></thead>
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
          <div><p className="eyebrow">TELEMETRIA</p><h2>Atividade recente</h2></div>
          <span className="live-dot">● AO VIVO</span>
        </div>
        <ActivityItem title="Sessão iniciada" detail={`Login autorizado para ${user.username}`} active />
        <ActivityItem title="IBGE consultado" detail="População estimada via API SIDRA" />
      </article>
    </section>
  );
}

function ActivityItem({ title, detail, active = false }) {
  return (
    <div className="activity-item">
      <span className={`activity-marker${active ? ' green' : ''}`} />
      <div><strong>{title}</strong><p>{detail}</p></div>
      <time>agora</time>
    </div>
  );
}

function Participants({ data }) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('todos');
  const roles = [...new Set(data.users.map((person) => person.role))];
  const normalizedQuery = query.toLowerCase();
  const people = data.users.filter((person) => (
    (role === 'todos' || person.role === role)
    && `${person.name} ${person.username}`.toLowerCase().includes(normalizedQuery)
  ));
  const administrators = data.users.filter((person) => person.role.toLowerCase().includes('admin')).length;
  const analysts = data.users.filter((person) => person.role.toLowerCase().includes('analista')).length;

  return (
    <section className="page-stack">
      <div className="stats">
        <SummaryCard label="TOTAL DE PARTICIPANTES" value={data.users.length} detail="contas cadastradas" />
        <SummaryCard label="ADMINISTRADORES" value={administrators} detail="acesso administrativo" />
        <SummaryCard label="ANALISTAS" value={analysts} detail="acesso de laboratório" />
      </div>

      <article className="panel">
        <div className="panel-title">
          <div><p className="eyebrow">CONTAS CADASTRADAS</p><h2>Todos os participantes</h2></div>
          <span className="count-pill">{people.length} de {data.users.length}</span>
        </div>
        <div className="toolbar">
          <input aria-label="Buscar participante" placeholder="Buscar por nome ou identificador…" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select aria-label="Filtrar por perfil" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="todos">Todos os perfis</option>
            {roles.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>NOME</th><th>IDENTIFICADOR</th><th>PERFIL</th><th>CADASTRO</th><th>STATUS</th></tr></thead>
            <tbody>
              {people.map((person) => (
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
          {people.length === 0 && <p className="empty-state">Nenhum participante encontrado.</p>}
        </div>
      </article>
      <p className="simulation-note">Lista demonstrativa baseada nas contas do banco local deste laboratório.</p>
    </section>
  );
}

function SummaryCard({ label, value, detail }) {
  return (
    <article>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

const simulatedEvents = [
  { time: 'agora', type: 'Sessão', title: 'Login realizado', detail: 'Sessão autenticada para o usuário atual.', tone: 'green' },
  { time: 'há 2 min', type: 'Segurança', title: 'Tentativa de acesso registrada', detail: 'Uma tentativa de login inválida foi simulada e registrada.', tone: 'amber' },
  { time: 'há 8 min', type: 'Dados', title: 'Painel de participantes consultado', detail: 'A lista de contas locais foi carregada para esta demonstração.', tone: 'blue' },
  { time: 'há 14 min', type: 'Integração', title: 'Consulta ao serviço do IBGE', detail: 'Consulta de população concluída ou marcada como indisponível.', tone: 'blue' },
  { time: 'há 26 min', type: 'Sistema', title: 'Laboratório iniciado', detail: 'API local e interface do laboratório ficaram disponíveis.', tone: 'green' },
  { time: 'há 41 min', type: 'Segurança', title: 'Revisão de autenticação', detail: 'Evento fictício para demonstrar a trilha de auditoria.', tone: 'amber' },
];

function ActivityPage({ user }) {
  const [filter, setFilter] = useState('todos');
  const categories = [...new Set(simulatedEvents.map((event) => event.type))];
  const events = simulatedEvents.filter((event) => filter === 'todos' || event.type === filter);

  return (
    <section className="page-stack">
      <div className="activity-summary">
        <div>
          <span className="stat-label">EVENTOS NA SIMULAÇÃO</span>
          <strong>{simulatedEvents.length}</strong>
          <small>linha do tempo demonstrativa</small>
        </div>
        <label>
          Categoria
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="todos">Todas</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
      </div>

      <article className="panel">
        <div className="panel-title">
          <div><p className="eyebrow">TRILHA DE AUDITORIA</p><h2>Atividade recente</h2></div>
          <span className="simulation-badge">SIMULADA</span>
        </div>
        <div className="timeline">
          {events.map((event, index) => (
            <div className="timeline-item" key={event.title}>
              <span className={`timeline-marker ${event.tone}`} />
              <div className="timeline-copy">
                <div className="timeline-heading"><strong>{event.title}</strong><span>{event.type}</span></div>
                <p>{event.detail}{index === 0 ? ` Usuário: ${user.username}.` : ''}</p>
              </div>
              <time>{event.time}</time>
            </div>
          ))}
        </div>
        {events.length === 0 && <p className="empty-state">Não há eventos nesta categoria.</p>}
      </article>
      <p className="simulation-note">Eventos fictícios para demonstração da interface. Nenhuma atividade é gravada no servidor.</p>
    </section>
  );
}
