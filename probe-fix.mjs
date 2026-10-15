import { writeFileSync } from 'node:fs';
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection({ host:'localhost', port:3306, user:'root', password:'123456', database:'ry-vue' });
const L = [];
const [tabs] = await conn.query(`SHOW TABLES`);
const names = tabs.map(t => Object.values(t)[0]);
L.push('ry-vue 全部表:');
L.push(names.join(', '));
// 关键表存在性
for (const t of ['sys_notice','sys_config','sys_user','sys_dept']) {
  L.push(`\n${t}: ${names.includes(t) ? '✅ 存在' : '❌ 不存在'}`);
}
if (names.includes('sys_config')) {
  const [cfg] = await conn.query(`SELECT config_key, config_value, config_name FROM sys_config WHERE config_key IN ('sys.user.initPassword','sys.account.captchaEnabled')`);
  L.push('\nsys_config 相关 key:');
  for (const c of cfg) L.push('  ' + JSON.stringify(c));
}
writeFileSync('probe-fix.txt', L.join('\n'), 'utf8');
conn.end();
