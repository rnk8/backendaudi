// backend/server.js
import express from 'express';
import cors from 'cors';
import authRoutes from './server/routes/authRoutes.js'; // Ruta correcta

const app = express();
const PORT = process.env.PORT || 4000; // Usar el puerto de la variable de entorno o 4000 por defecto

// Configuración de CORS para permitir solicitudes desde el frontend en Vercel
app.use(cors({
  origin: 'https://frontend-vite.vercel.app', // Cambia esto por la URL de tu frontend en Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Para parsear application/json
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded

// Configura las rutas de autenticación
app.use('/api/auth', authRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err); // Muestra el error completo en la consola
  res.status(500).json({ error: 'Algo salió mal!', details: err.message }); // Envía un objeto JSON con el error
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
