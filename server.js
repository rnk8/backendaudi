import express from 'express';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import authRoutes from './server/routes/authRoutes.js'

const { Pool } = pg;
const app = express();

// Configuración de CORS
const allowedOrigins = [
  'https://auditoria-murex.vercel.app',  // Agrega aquí tu URL de Vercel
  'https://frontend-vite.vercel.app',    // Mantén aquí cualquier otro origen permitido
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Asegúrate de incluir los métodos que usas
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes); // Montaje en el prefijo /api/auth
// Configuración del pool de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const saltRounds = 10;  // Define saltRounds aquí, se usará más adelante

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
    if (err.code === '23505') {
      // Código de error para entradas duplicadas
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

const PORT = process.env.PORT || 5000;  // Define el puerto aquí
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});