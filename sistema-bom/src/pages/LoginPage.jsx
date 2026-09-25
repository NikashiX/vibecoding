import { useState } from 'react';
import { api } from '../lib/api.js';
import Brand from '../components/Brand.jsx';

export default function LoginPage({ onLogin }) {
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
          <p className="eyebrow">AMBIENTE DE TREINAMENTO · 02</p>
          <h1>Observe.<br /><em>Proteja.</em><br />Aprenda.</h1>
          <p>
            Uma versão reforçada do laboratório, com autenticação preparada
            para resistir a entradas maliciosas.
          </p>
        </div>
        <div className="status-line">
          <span className="pulse" /> ambiente seguro ativo
          <span className="mono">127.0.0.1</span>
        </div>
      </section>

      <section className="login-card-wrap">
        <div className="login-card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">ACESSO SEGURO</p>
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
              maxLength="50"
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
              maxLength="128"
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
          <p className="lab-note">
            Consulta parametrizada e senhas armazenadas com hash seguro.
          </p>
        </div>

        <div className="card-footer">
          <span>VIBE SECURITY LAB</span>
          <span>seguro / v1.0.0</span>
        </div>
      </section>
    </main>
  );
}
