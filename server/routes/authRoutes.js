// server/routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../../config/database.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verificar si el usuario ya existe
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error del servidor al registrar el usuario' });
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
router.post('/saveAmount', async (req, res) => {
  const { userId, amount } = req.body;

  try {
    await pool.query(
      'INSERT INTO amounts (user_id, amount) VALUES ($1, $2)',
      [userId, amount]
    );
    res.status(201).json({ message: 'Monto guardado exitosamente' });
  } catch (error) {
    console.error('Error al guardar el monto en la base de datos:', error);
    res.status(500).json({ message: 'Error del servidor al guardar el monto' });
  }
});

export default router;
