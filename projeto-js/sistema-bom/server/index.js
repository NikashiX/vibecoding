import express from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { z } from 'zod';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dataPath = join(root, 'data');
mkdirSync(dataPath, { recursive: true });
const db = new Database(join(dataPath, 'secure.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'Analista', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
if (!db.prepare('SELECT COUNT(*) AS total FROM users').get().total) {
  const insert = db.prepare('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)');
  insert.run('Marina Costa', 'marina', bcrypt.hashSync('vibe2026', 12), 'Administradora');
  insert.run('Rafael Lima', 'rafael', bcrypt.hashSync('lab-demo', 12), 'Analista');
}

const app = express();
const SQLiteStore = connectSqlite3(session);
app.disable('x-powered-by');
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:'10kb'}));
app.use(session({
  name:'vibe.sid',
  secret:process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  store:new SQLiteStore({db:'sessions.sqlite',dir:dataPath}),
  resave:false,
  saveUninitialized:false,
  cookie:{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',maxAge:1000*60*60}
}));
const loginSchema=z.object({username:z.string().trim().min(1).max(50),password:z.string().min(1).max(128)});
const loginLimiter=rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Muitas tentativas. Aguarde alguns minutos.'}});

app.post('/api/login', loginLimiter, async (req,res) => {
  const parsed=loginSchema.safeParse(req.body);
  if(!parsed.success)return res.status(400).json({error:'Dados de acesso inválidos.'});
  const user=db.prepare('SELECT * FROM users WHERE username = ? LIMIT 1').get(parsed.data.username);
  if(!user || !(await bcrypt.compare(parsed.data.password,user.password)))return res.status(401).json({error:'Usuário ou senha não encontrados.'});
  req.session.regenerate(error=>{
    if(error)return res.status(500).json({error:'Não foi possível iniciar a sessão.'});
    req.session.user={id:user.id,name:user.name,username:user.username,role:user.role};
    res.json({user:req.session.user});
  });
});
app.get('/api/me',(req,res)=>req.session.user?res.json({user:req.session.user}):res.status(401).json({error:'Não autenticado.'}));
app.post('/api/logout',(req,res)=>req.session.destroy(error=>error?res.status(500).json({error:'Não foi possível encerrar a sessão.'}):res.clearCookie('vibe.sid').status(204).end()));
app.get('/api/dashboard',requireLogin,async(req,res)=>{
  const users=db.prepare('SELECT name, username, role, created_at FROM users ORDER BY id DESC').all();
  res.json({users,population:await population(),user:req.session.user});
});
function requireLogin(req,res,next){if(!req.session.user)return res.status(401).json({error:'Não autenticado.'});next();}
async function population(){try{const response=await fetch('https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2024/variaveis/9324?localidades=N1%5Ball%5D',{headers:{Accept:'application/json','User-Agent':'VibeSecurityLab/2.0'},signal:AbortSignal.timeout(5000)});if(!response.ok)return null;const data=await response.json();const value=data?.[0]?.variavel?.[0]?.resultados?.[0]?.series?.[0]?.serie?.['2024'];return Number.isFinite(Number(value))?{value:Number(value),year:2024}:null;}catch{return null;}}
if(process.env.NODE_ENV==='production')app.use(express.static(join(root,'dist')));
app.use((error,req,res,next)=>{console.error(error);res.status(500).json({error:'Erro interno do servidor.'});});
app.listen(process.env.PORT||3002,()=>console.log('Sistema bom: API em http://localhost:3002'));
