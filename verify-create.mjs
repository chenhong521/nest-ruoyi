import { writeFileSync } from 'node:fs';
const base = 'http://localhost:8080';
const L = [];
const img = await (await fetch(`${base}/captchaImage`)).json();
const { Redis } = await import('ioredis');
const redis = new Redis({ host:'localhost', port:6379 });
const code = await redis.get(`captcha_codes:${img.uuid}`);
const login = await (await fetch(`${base}/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username:'admin', password:'admin123', code, uuid:img.uuid }) })).json();
const H = { Authorization:`Bearer ${login.token}`, 'Content-Type':'application/json' };
const j = async (u, o={}) => await (await fetch(base+u, { headers:H, ...o })).json();

const r = await j('/system/user', { method:'POST', body: JSON.stringify({ userName:'testuser1', nickName:'测试用户', deptId:100, sex:'0', status:'0', roleIds:[2], postIds:[1] }) });
L.push('新增: code=' + r.code);
L.push('body: ' + JSON.stringify(r));
writeFileSync('E:/code/node/nest-ruoyi/verify-create.txt', L.join('\n'), 'utf8');
redis.quit();
