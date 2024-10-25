import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'ren',             // Cambia esto por tu usuario de PostgreSQL
  host: 'backendaudi.onrender.com', // Asegúrate de que no esté 'https://'
  database: 'audi',               // Cambia esto por el nombre de tu base de datos
  password: '0808',               // Cambia esto por tu contraseña
  port: 5432,                     // Puerto por defecto de PostgreSQL
  connectionTimeoutMillis: 5000, // 5 segundos de tiempo de espera
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
