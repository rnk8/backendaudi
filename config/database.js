// config/database.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'ren',
  host: 'localhost',
  database: 'audi',
  password: '0808',
  port: 5432, // Puerto por defecto de PostgreSQL
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectarse a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos:', res.rows);
  }
});

pool.connect()
  .then(() => console.log('Conectado a la base de datos PostgreSQL'))
  .catch((err) => console.error('Error al conectar a PostgreSQL', err));

export default pool;
