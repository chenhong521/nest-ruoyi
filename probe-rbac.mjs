import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'localhost', user: 'root', password: '123456', database: 'ry-vue',
});
const tables = ['sys_role', 'sys_menu', 'sys_user_role', 'sys_role_menu', 'sys_dept'];
for (const t of tables) {
  const [cols] = await conn.query(
    `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA='ry-vue' AND TABLE_NAME=? ORDER BY ORDINAL_POSITION`, [t]);
  console.log(`\n=== ${t} (${cols.length}列) ===`);
  for (const c of cols) {
    console.log(`  ${c.COLUMN_NAME.padEnd(20)} ${c.DATA_TYPE.padEnd(10)} null=${c.IS_NULLABLE} ${c.COLUMN_KEY === 'PRI' ? '[PK]' : ''}`);
  }
}
await conn.end();
