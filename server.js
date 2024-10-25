import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './server/routes/authRoutes.js'; // Asegúrate de que esta ruta sea correcta

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Configura las rutas de autenticación
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
