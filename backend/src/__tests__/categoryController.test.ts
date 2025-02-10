import { getCategories, updateCategory, deleteCategory, searchCategory } from "../controllers/categoryController";
import Category from "../models/Category";
import User from "../models/User";


jest.mock("../models/Category");
jest.mock("../models/User");

describe("Category Controller", () => {
  let mockReq: any;
  let mockRes: any;
  let next: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  
  // 🔹 Buscar categorias
  it("Deve buscar categorias pelo userId", async () => {
    mockReq.params = { userId: "12345" };

    (Category.find as jest.Mock).mockResolvedValue([{ _id: "1", name: "Categoria A", userId: "12345" }]);

    await getCategories(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ categorias: [{ _id: "1", name: "Categoria A", userId: "12345" }] });
  });

  // 🔹 Atualizar categoria
  it("Deve atualizar uma categoria", async () => {
    mockReq.params = { id: "1" };
    mockReq.body = { name: "Categoria Atualizada", userId: "12345" };

    (User.findById as jest.Mock).mockResolvedValue(true);
    (Category.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: "1", name: "Categoria Atualizada", userId: "12345" });

    await updateCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ category: { _id: "1", name: "Categoria Atualizada", userId: "12345" } });
  });

  // 🔹 Deletar categoria
  it("Deve deletar uma categoria", async () => {
    mockReq.params = { id: "1" };

    (Category.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "1", name: "Categoria A" });

    await deleteCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Categoria deletada com sucesso." });
  });

  // 🔹 Buscar categorias por nome
  it("Deve buscar categorias pelo nome", async () => {
    mockReq.params = { userId: "12345", query: "Categoria" };

    (Category.find as jest.Mock).mockResolvedValue([{ _id: "1", name: "Categoria X", userId: "12345" }]);

    await searchCategory(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ categorias: [{ _id: "1", name: "Categoria X", userId: "12345" }] });
  });
});
