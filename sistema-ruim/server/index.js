import express from 'express';
import session from 'express-session';
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
mkdirSync(join(root, 'data'), { recursive: true });
const db = new Database(join(root, 'data', 'lab.sqlite'));
db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'Analista', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
if (!db.prepare('SELECT COUNT(*) AS total FROM users').get().total) {
  const insert = db.prepare('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)');
  insert.run('Marina Costa', 'marina', 'vibe2026', 'Administradora');
  insert.run('Rafael Lima', 'rafael', 'lab-demo', 'Analista');
}

const app = express();
app.use(express.json());
app.use(session({secret:'segredo-fraco-do-laboratorio',resave:false,saveUninitialized:false,cookie:{httpOnly:true}}));

app.post('/api/login', (req, res) => {
  const { username = '', password = '' } = req.body;
  // LAB: vulnerável de propósito. Nunca concatene entrada do usuário em SQL real.
  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}' LIMIT 1`;
  try {
    const user = db.prepare(sql).get();
    if (!user) return res.status(401).json({error:'Usuário ou senha não encontrados.'});
    req.session.user = {id:user.id,name:user.name,username:user.username,role:user.role};
    res.json({user:req.session.user});
  } catch {
    res.status(400).json({error:'A consulta retornou um erro. Revise os dados enviados.'});
  }
});
app.get('/api/me', (req,res) => req.session.user ? res.json({user:req.session.user}) : res.status(401).json({error:'Não autenticado.'}));
app.post('/api/logout', (req,res) => req.session.destroy(() => res.status(204).end()));
app.get('/api/dashboard', requireLogin, async (req,res) => {
  const users = db.prepare('SELECT name, username, role, created_at FROM users ORDER BY id DESC').all();
  res.json({users,population:await population(),user:req.session.user});
});
function requireLogin(req,res,next){ if(!req.session.user)return res.status(401).json({error:'Não autenticado.'}); next(); }
function populationRequestOptions() {
  return {
    headers: { Accept: 'application/json', 'User-Agent': 'VibeSecurityLab/1.0' },
    signal: AbortSignal.timeout(8000),
  };
}

async function population() {
  try {
    return await Promise.any([
      populationFromSidra(),
      populationFromAggregatesApi(),
    ]);
  } catch {
    return null;
  }
}

async function populationFromSidra() {
  const response = await fetch(
    'https://apisidra.ibge.gov.br/values/t/6579/n1/all/v/9324/p/last%201?formato=json',
    populationRequestOptions(),
  );
  if (!response.ok) throw new Error(`SIDRA respondeu ${response.status}`);

  const rows = await response.json();
  const record = rows.slice(1).find((row) => row.D1C === '1' && row.V && row.V !== '...');
  const value = Number(record?.V);
  const year = Number(record?.D3C);

  if (!Number.isFinite(value) || !Number.isFinite(year)) {
    throw new Error('A resposta SIDRA não contém a população nacional.');
  }

  return { value, year };
}

async function populationFromAggregatesApi() {
  const response = await fetch(
    'https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/last%201/variaveis/9324?localidades=N1%5Ball%5D',
    populationRequestOptions(),
  );
  if (!response.ok) throw new Error(`API de agregados respondeu ${response.status}`);

  const data = await response.json();
  const series = data?.[0]?.variavel?.[0]?.resultados?.[0]?.series?.[0]?.serie;
  const year = Object.keys(series || {})
    .filter((period) => /^\d{4}$/.test(period))
    .sort()
    .at(-1);
  const value = Number(series?.[year]);

  if (!Number.isFinite(value) || !year) {
    throw new Error('A API de agregados não retornou população.');
  }

  return { value, year: Number(year) };
}
if(process.env.NODE_ENV==='production')app.use(express.static(join(root,'dist')));
app.listen(process.env.PORT || 3001,()=>console.log('Sistema ruim: API em http://localhost:3001'));
