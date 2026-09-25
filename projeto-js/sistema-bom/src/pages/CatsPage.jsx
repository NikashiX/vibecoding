import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import './CatsPage.css';

export default function CatsPage() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCats(await api('/cats'));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCats(); }, [loadCats]);

  return (
    <section className="page-stack cats-page">
      <div className="cats-intro">
        <div>
          <p className="eyebrow">INTEGRAÇÃO EXTERNA · THECATAPI</p>
          <h2>Uma pausa para gatos.</h2>
          <p>Imagens e raças carregadas pela API. A credencial fica somente no servidor.</p>
        </div>
        <button className="cats-refresh" type="button" onClick={loadCats} disabled={loading}>
          {loading ? 'Carregando…' : '↻ Atualizar galeria'}
        </button>
      </div>

      {error && <div className="alert" role="alert">{error}</div>}
      {loading && <p className="loading cats-loading">Buscando imagens…</p>}
      {!loading && !error && (
        <div className="cats-grid">
          {cats.map((cat) => (
            <article className="cat-card" key={cat.id}>
              <img src={cat.url} alt={cat.breeds?.[0]?.name ? `Gato da raça ${cat.breeds[0].name}` : 'Gato'} loading="lazy" />
              <div>
                <strong>{cat.breeds?.[0]?.name || 'Gato sem raça identificada'}</strong>
                <p>{cat.breeds?.[0]?.temperament || 'Imagem aleatória da TheCatAPI'}</p>
              </div>
            </article>
          ))}
          {cats.length === 0 && <p className="empty-state">A API não retornou imagens nesta consulta.</p>}
        </div>
      )}
      <p className="simulation-note">Requisição feita pelo backend; a chave não é enviada ao navegador.</p>
    </section>
  );
}
