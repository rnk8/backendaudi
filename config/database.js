import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,          // 'ren'
  host: process.env.DB_HOST,          // 'backendaudi.onrender.com'
  database: process.env.DB_DATABASE,  // 'audi'
  password: process.env.DB_PASSWORD,  // '0808'
  port: process.env.DB_PORT,          // 5432
  connectionTimeoutMillis: 15000,     // Ajusta el tiempo de espera si es necesario
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
