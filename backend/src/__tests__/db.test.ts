import { connectDB } from '../config/db';
import mongoose from 'mongoose';

// Mockando todo o mongoose
jest.mock('mongoose');

describe("connectDB", () => {
  let consoleErrorMock: jest.SpyInstance;
  let processExitMock: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mockando console.error para evitar poluição no log do teste
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mockando process.exit para evitar encerramento do teste
    processExitMock = jest
  .spyOn(process, "exit")
  .mockImplementation(() => undefined as never);

  

  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
    processExitMock.mockRestore();
  });

  it("should connect to MongoDB successfully", async () => {
    const mockDb = { databaseName: "mockDB" };

    const mockConnection = {
      connection: {
        db: mockDb,
      },
    };

    (mongoose.connect as jest.Mock).mockResolvedValueOnce(mockConnection);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
  });

  it("should handle error when connection fails", async () => {
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error("Erro ao conectar"));

    await connectDB();

    expect(consoleErrorMock).toHaveBeenCalledWith("Erro ao conectar ao MongoDB:", expect.any(Error));
    expect(processExitMock).toHaveBeenCalledWith(1); // Verifica que o processo exit foi chamado
  });

  it("should handle undefined db connection", async () => {
    const mockConnection = {
      connection: {
        db: undefined,
      },
    };

    (mongoose.connect as jest.Mock).mockResolvedValueOnce(mockConnection);

    await connectDB();

    expect(consoleErrorMock).toHaveBeenCalledWith("Erro ao conectar ao MongoDB:", expect.any(Error));
    expect(processExitMock).toHaveBeenCalledWith(1); // O teste verifica se o exit foi chamado
  });

});
