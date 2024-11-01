import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../config/database.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const saltRounds = 10;  // Define saltRounds aquí, se usará más adelante

// Ruta de registro
router.post('/register', async (req, res) => {
  console.log('Datos recibidos:', req.body); // Log para verificar que recibes los datos
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Error en la creación del usuario:', err);
    if (err.code === '23505') {
      res.status(400).json({ success: false, message: 'El nombre de usuario o correo ya existe' });
    } else {
      res.status(500).json({ success: false, message: 'Error interno del servidor', error: err.message });
    }
  }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (err) {
    console.error('Error en la autenticación:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
