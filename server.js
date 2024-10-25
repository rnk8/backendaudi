import express from 'express';
import cors from 'cors';
import authRoutes from './server/routes/authRoutes.js'; // Asegúrate de que esta ruta sea correcta

const app = express();
const PORT = process.env.PORT || 4000; // Usa el puerto de la variable de entorno o 4000 como predeterminado

app.use(cors()); // Permitir todos los orígenes (solo para pruebas)

app.use(express.json()); // Para parsear application/json
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded

// Configura las rutas de autenticación
app.use('/api/auth', authRoutes);


// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err); // Muestra el error completo en la consola
  res.status(500).json({ error: 'Algo salió mal!', details: err.message }); // Envía un objeto JSON con el error
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
