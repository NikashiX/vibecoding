import Brand from './Brand.jsx';

const navigation = [
  { id: 'overview', label: '◈ Visão geral' },
  { id: 'participants', label: '◌ Participantes' },
  { id: 'activity', label: '↯ Atividade' },
];

const pageLabels = {
  overview: 'VISÃO GERAL',
  participants: 'PARTICIPANTES',
  activity: 'ATIVIDADE',
};

const pageTitles = {
  participants: 'Participantes',
  activity: 'Atividade do laboratório',
};

export default function DashboardLayout({
  user,
  page,
  onNavigate,
  onLogout,
  children,
}) {
  const title = page === 'overview'
    ? `Olá, ${user.name.split(' ')[0]}.`
    : pageTitles[page];

  return (
    <>
      <aside className="sidebar">
        <Brand />
        <nav aria-label="Navegação principal">
          {navigation.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={page === id ? 'active' : ''}
              aria-current={page === id ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(id);
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="side-bottom">
          <div className="side-status">
            <span className="pulse" /> sistema online
          </div>
          <button className="logout" onClick={onLogout}>
            Sair da conta <span>↗</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">PAINEL DE CONTROLE / {pageLabels[page]}</p>
            <h1>{title}</h1>
          </div>
          <div className="profile">
            <div className="avatar">{user.name[0]}</div>
            <div>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </div>
          </div>
        </header>

        {children}

        <footer>
          <span>VIBE SECURITY LAB © 2026</span>
          <span>{page === 'overview' ? 'dados: IBGE / SIDRA' : 'simulação local'}</span>
        </footer>
      </main>
    </>
  );
}
