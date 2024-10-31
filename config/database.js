const express = require('express');
const pg = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypts');

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 10000;
const saltRounds = 10;

  // Middlewares
   app.use(cors({
     origin: 'https://auditoria-murex.vercel.app', // Asegúrate de usar el dominio correcto aquí
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
     credentials: true, // Si estás usando credenciales como cookies o autenticación de usuario
   }));
   app.use(express.json());

// Configuración del pool de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err) => {
  if (err) {
    console.error('Error al conectarse a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // Código de error para entradas duplicadas
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      console.error('Error executing query', err.stack);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});