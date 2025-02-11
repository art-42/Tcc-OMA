import { getNoteById, deleteNote, updateNote } from "../controllers/noteController";
import request from "supertest";
import Note from "../models/Note";
import { Request, Response } from "express";
import app from "../app";

jest.mock("../models/Note");

describe("Testando noteController", () => {
  it("Deve retornar uma nota pelo ID", async () => {
    const mockNote = { 
      _id: "12345", 
      userId: "67890", 
      type: "texto",
      title: "Minha Nota",
      content: "Conteúdo da nota",
      populate: jest.fn().mockResolvedValue({
        _id: "12345", 
        userId: "67890", 
        type: "texto", 
        title: "Minha Nota",
        content: "Conteúdo da nota",
      })
    };

    (Note.findOne as jest.Mock).mockReturnValue(mockNote);

    const req = {
      params: { noteId: "12345", userId: "67890" }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getNoteById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: "12345", 
      userId: "67890", 
      type: "texto", 
      title: "Minha Nota",
      content: "Conteúdo da nota",
    });
  });


  it("Deve retornar 500 se ocorrer um erro", async () => {
    (Note.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("Erro inesperado");
    });

    const req = {
      params: { noteId: "12345", userId: "67890" }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getNoteById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar anotação." });
  });
});

describe("Testando addNoteToGroup", () => {
    afterEach(() => {
      jest.clearAllMocks(); // Limpa os mocks após cada teste
    });
  
    it("Deve retornar 400 se faltar um campo obrigatório", async () => {
      const res = await request(app)
        .post("/notes/user123")
        .send({
          title: "Minha Nota",
          content: "Conteúdo da nota",
          type: "texto",
        });
  
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Título, tipo, groupId e conteúdo são obrigatórios." });
    });
  
    it("Deve retornar 400 se o tipo for inválido", async () => {
      const res = await request(app)
        .post("/notes/user123")
        .send({
          title: "Minha Nota",
          content: "Conteúdo da nota",
          type: "invalido",
          groupId: "group123",
        });
  
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Tipo inválido. Deve ser 'texto', 'arquivo', 'foto' ou 'desenho." });
    });
  
    it("Deve retornar 400 se o tipo for 'arquivo' e não tiver 'fileName'", async () => {
      const res = await request(app)
        .post("/notes/user123")
        .send({
          title: "Minha Nota",
          content: "Conteúdo da nota",
          type: "arquivo",
          groupId: "group123",
        });
  
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Nome do arquivo é obrigatório para o tipo 'arquivo'." });
    });
  
    it("Deve retornar 500 se ocorrer um erro no servidor", async () => {
      (Note as any).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error("Erro no banco")),
      }));
  
      const res = await request(app)
        .post("/notes/user123")
        .send({
          title: "Minha Nota",
          content: "Conteúdo da nota",
          type: "texto",
          groupId: "group123",
        });
  
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Erro ao criar a nota" });
    });

    it("Deve retornar 404 se não encontrar a nota para deletar", async () => {
      (Note.findOneAndDelete as jest.Mock).mockResolvedValue(null);
  
      const req = {
        params: { noteId: "12345", userId: "67890" },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      await deleteNote(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Anotação não encontrada ou não pertence ao usuário." });
    });

    it("Deve excluir uma nota com sucesso", async () => {
      const req = {
        params: { noteId: "12345", userId: "67890" },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      (Note.findOneAndDelete as jest.Mock).mockResolvedValue({
        _id: "12345",
        userId: "67890",
        title: "Nota Deletada",
        content: "Conteúdo da nota",
        type: "texto",
      });
  
      await deleteNote(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Anotação deletada com sucesso." });
    });

    it("Deve retornar 404 se não encontrar a nota para atualização", async () => {
      (Note.findOne as jest.Mock).mockResolvedValue(null);
  
      const req = {
        params: { noteId: "12345", userId: "67890" },
        body: { title: "Nota Atualizada", content: "Novo conteúdo" }
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      await updateNote(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Nota não encontrada ou não pertence ao usuário" });
    });


    it("Deve retornar 400 se faltar um campo obrigatório ao adicionar nota", async () => {
      const res = await request(app)
        .post("/notes/user123")
        .send({
          title: "Minha Nota",
          content: "Conteúdo da nota",
          type: "texto",
        });
  
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Título, tipo, groupId e conteúdo são obrigatórios." });
    });

    it("Deve retornar 500 se ocorrer um erro ao buscar a nota", async () => {
      (Note.findOne as jest.Mock).mockImplementation(() => {
        throw new Error("Erro inesperado");
      });
  
      const req = {
        params: { noteId: "12345", userId: "67890" }
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      await getNoteById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar anotação." });
    });
  

  });
  