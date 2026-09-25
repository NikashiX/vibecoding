export default function StatsCards({ data }) {
  return (
    <section className="stats" aria-label="Resumo do laboratório">
      <article>
        <span className="stat-label">USUÁRIOS NO BANCO</span>
        <strong>{data.users.length}</strong>
        <small>desde a inicialização</small>
      </article>
      <article>
        <span className="stat-label">POPULAÇÃO DO BRASIL</span>
        <strong>{data.population?.value.toLocaleString('pt-BR') || '—'}</strong>
        <small>
          <i>IBGE</i> estimativa {data.population?.year || 'indisponível'}
        </small>
      </article>
      <article>
        <span className="stat-label">STATUS DA SESSÃO</span>
        <strong className="green-text">ATIVA</strong>
        <small>autenticado agora</small>
      </article>
    </section>
  );
}
