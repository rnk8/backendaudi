import express from 'express';
import pg from 'pg';
import cors from 'cors';
import authRoutes from './server/routes/authRoutes.js';

const { Pool } = pg;
const app = express();

// Configuración de CORS
const allowedOrigins = [
  'https://auditoria-tau.vercel.app',
  'https://frontend-vite.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
