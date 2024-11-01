import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  connectionString: process.env.DATABASE_URL, // Asegúrate de que esta variable de entorno esté configurada
  ssl: {
    rejectUnauthorized: false // Para entornos de producción
  }
});

pool.connect((err) => {
  if (err) {
    console.error('Error al conectarse a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

export default pool;
