   import express from 'express';
   import pg from 'pg';
   import cors from 'cors';
   import bcrypt from 'bcrypts';

   const { Pool } = pg;
   const app = express();
   // Configuración de CORS
  const allowedOrigins = [
  'https://auditoria-murex.vercel.app',
  'https://frontend-vite.vercel.app'
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

   // Configuración del pool de PostgreSQL
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: {
       rejectUnauthorized: false
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

   app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
   });