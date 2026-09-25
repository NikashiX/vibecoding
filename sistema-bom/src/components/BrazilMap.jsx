import './BrazilMap.css';

export default function BrazilMap({ population }) {
  const formattedPopulation = population?.value
    ? population.value.toLocaleString('pt-BR')
    : '—';

  return (
    <section className="map-panel panel" aria-labelledby="brazil-map-title">
      <div className="map-copy">
        <p className="eyebrow">VISÃO TERRITORIAL</p>
        <h2 id="brazil-map-title">Brasil em foco</h2>
        <p className="map-description">
          Referência geográfica para os dados nacionais apresentados no painel.
        </p>
        <div className="map-metric">
          <span className="stat-label">POPULAÇÃO ESTIMADA</span>
          <strong>{formattedPopulation}</strong>
          <small>Brasil · {population?.year || 'ano indisponível'} · IBGE</small>
        </div>
        <div className="map-legend">
          <span><i className="map-legend-dot" /> capitais em destaque</span>
          <span className="map-source">Mapa: Natural Earth · 1:110m</span>
        </div>
      </div>

      <div className="map-visual" role="img" aria-label="Mapa ilustrativo do Brasil com capitais em destaque">
        <svg viewBox="0 0 340 360" aria-hidden="true">
          <defs>
            <linearGradient id="brazil-map-fill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#d7fa68" />
              <stop offset="100%" stopColor="#a9d95f" />
            </linearGradient>
          </defs>
          <path
            className="brazil-map-shape"
            d="M176.7 343.1 L173.5 328.7 L144.4 313.4 L174.6 285.9 L174.7 279.2 L167.1 276.0 L169.7 261.6 L161.3 261.1 L158.2 247.7 L142.0 245.5 L140.3 229.5 L145.3 212.8 L139.7 197.1 L125.1 196.8 L122.5 176.0 L85.3 157.6 L85.8 142.5 L63.5 153.0 L46.2 152.9 L46.7 140.2 L33.8 144.9 L25.9 140.0 L20.1 123.8 L28.4 105.0 L51.2 96.9 L54.8 70.3 L50.3 56.4 L56.3 52.7 L51.8 46.6 L69.1 43.9 L72.7 51.5 L84.2 54.4 L100.7 42.6 L93.9 40.1 L89.8 27.1 L102.8 29.4 L119.0 23.0 L120.8 17.5 L126.5 19.1 L129.8 27.9 L126.5 37.9 L133.7 49.9 L156.7 45.8 L156.9 40.0 L180.0 43.2 L192.3 25.8 L202.5 46.4 L199.3 61.6 L212.8 62.9 L213.0 71.3 L218.8 65.8 L241.0 73.9 L243.4 83.4 L278.4 85.0 L299.3 101.2 L311.7 104.0 L318.3 122.3 L315.2 136.1 L288.3 170.0 L283.8 210.2 L271.1 244.2 L263.1 252.9 L242.9 256.0 L220.1 268.9 L213.7 277.1 L210.7 300.5 L176.7 343.1 Z"
          />
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
  );
}
