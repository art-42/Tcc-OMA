import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from "./config/db";

dotenv.config();

const mongoUri = process.env.MONGO_URI as string;
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));

app.use('/', userRoutes);


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

(async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB with mongoose');

    await connectDB();

    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Error connecting to MongoDB or initializing server:', err);
    process.exit(1); 
  }
})();

export default app;