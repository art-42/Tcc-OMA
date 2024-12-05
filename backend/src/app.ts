import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';

// Configurações de ambiente
dotenv.config();
const mongoUri = process.env.MONGO_URI as string;
const port = process.env.PORT || 5000;

// Conexão com MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Inicialização do App
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/', userRoutes);

// Middleware de erro global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Inicialização do servidor
app.listen(port, () => console.log(`Server running on port ${port}`));

