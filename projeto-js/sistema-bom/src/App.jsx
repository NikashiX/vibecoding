import { useEffect, useState } from 'react';
import { api } from './lib/api.js';
import ActivityPage from './pages/ActivityPage.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import ParticipantsPage from './pages/ParticipantsPage.jsx';

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

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <AuthenticatedApp user={user} onLogout={handleLogout} />
  );
}

function AuthenticatedApp({ user, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [page, setPage] = useState('overview');

  useEffect(() => {
    api('/dashboard').then(setDashboard);
  }, []);

  if (!dashboard) {
    return <div className="loading">Carregando painel…</div>;
  }

  return (
    <DashboardLayout
      user={user}
      page={page}
      onNavigate={setPage}
      onLogout={onLogout}
    >
      {page === 'overview' && <OverviewPage data={dashboard} user={user} />}
      {page === 'participants' && <ParticipantsPage users={dashboard.users} />}
      {page === 'activity' && <ActivityPage user={user} />}
    </DashboardLayout>
  );
}
