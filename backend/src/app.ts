import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from "./config/db";

// Configurações de ambiente
dotenv.config();

const mongoUri = process.env.MONGO_URI as string;
const port = process.env.PORT || 5000;

// Inicialização do App
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));

// Rotas
app.use('/', userRoutes);

// Middleware de erro global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Conexão com MongoDB e Inicialização do GridFSBucket
(async () => {
  try {
    // Conecta com o MongoDB usando mongoose
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB with mongoose');

    // Conecta ao MongoDB manualmente para inicializar o GridFSBucket
    await connectDB();
    console.log('Connected to MongoDB with GridFSBucket');

    // Inicializa o servidor
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Error connecting to MongoDB or initializing server:', err);
    process.exit(1); // Encerra o processo em caso de falha
  }
})();
