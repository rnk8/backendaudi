import express from 'express';
import cors from 'cors';
import authRoutes from './server/routes/authRoutes.js'; // Asegúrate de que esta ruta sea correcta

const app = express();
const PORT = process.env.PORT || 4000; // Usa el puerto de la variable de entorno o 4000 como predeterminado

app.use(cors({
  origin: 'https://auditoria-murex.vercel.app',
}));
app.use(express.json()); // Para parsear application/json
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded

// Configura las rutas de autenticación
app.use('/api/auth', authRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
