// server/routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../config/database.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ success: false, message: 'El nombre de usuario o correo ya existe' });
    } else {
      console.error('Error ejecutando la consulta', err.stack);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    const token = 'tu_jwt_token'; // Aquí se debe generar un JWT real
    res.json({ success: true, token });
  } catch (err) {
    console.error('Error en la autenticación:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
