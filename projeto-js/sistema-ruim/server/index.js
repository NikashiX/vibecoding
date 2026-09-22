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
async function population(){try{const response=await fetch('https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2024/variaveis/9324?localidades=N1%5Ball%5D',{signal:AbortSignal.timeout(5000)});const data=await response.json();const value=data?.[0]?.variavel?.[0]?.resultados?.[0]?.series?.[0]?.serie?.['2024'];return Number.isFinite(Number(value))?{value:Number(value),year:2024}:null;}catch{return null;}}
if(process.env.NODE_ENV==='production')app.use(express.static(join(root,'dist')));
app.listen(process.env.PORT || 3001,()=>console.log('Sistema ruim: API em http://localhost:3001'));
