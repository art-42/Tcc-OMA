import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI as string;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoUri);

    console.log("Conectado ao MongoDB com Mongoose");

    const dbConnection = mongoose.connection.db;

    if (!dbConnection) {
      throw new Error("Conexão ao banco de dados não está definida.");
    }

  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
};
export { connectDB };