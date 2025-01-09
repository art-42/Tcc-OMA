import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

const mongoUri = process.env.MONGO_URI as string;

let gridFSBucket: GridFSBucket;

const connectDB = async () => {
  try {
    // Conecta ao MongoDB usando mongoose
    const connection = await mongoose.connect(mongoUri);

    console.log("Conectado ao MongoDB com Mongoose");

    // Obtém a conexão nativa do MongoDB a partir do mongoose
    const dbConnection = mongoose.connection.db;

    if (!dbConnection) {
      throw new Error("Conexão ao banco de dados não está definida.");
    }

    // Inicializa o GridFSBucket
    gridFSBucket = new GridFSBucket(dbConnection, {
      bucketName: 'uploads', // Nome do bucket, pode personalizar
    });
    console.log("GridFSBucket inicializado");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1); // Finaliza a aplicação em caso de erro
  }
};

export { connectDB, gridFSBucket };
