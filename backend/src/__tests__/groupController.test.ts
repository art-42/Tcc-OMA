import request from "supertest";
import app from "../app"; // Seu arquivo de configuração do Express
import Group from "../models/Group";
import User from "../models/User";
import Category from "../models/Category";
import Note from "../models/Note";

jest.mock("../models/Group");
jest.mock("../models/User");
jest.mock("../models/Category");
jest.mock("../models/Note");

describe("Group Controller", () => {

  describe("POST /groups", () => {
    
    it("should return error if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/groups")
        .send({ name: "New Group", categoryId: "abc", userId: "123" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Usuário não encontrado.");
    });

    it("should return error if category not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue({ _id: "123" });
      (Category.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/groups")
        .send({ name: "New Group", categoryId: "invalidCategoryId", userId: "123" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Categoria não encontrada.");
    });

    it("should return error if group saving fails", async () => {
      (User.findById as jest.Mock).mockResolvedValue({ _id: "123" });
      (Category.findById as jest.Mock).mockResolvedValue({ _id: "abc" });
      (Group.prototype.save as jest.Mock).mockRejectedValue(new Error("Erro ao salvar"));

      const response = await request(app)
        .post("/groups")
        .send({ name: "New Group", categoryId: "abc", userId: "123" });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao criar grupo.");
    });


  });

  describe("GET /searchGroups/:userId/:query", () => {
    it("should return groups matching the search query", async () => {
      const mockUser = { _id: "123", name: "User 1" };
      const mockGroup = { _id: "groupId", name: "Group 1", userId: "123" };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Group.find as jest.Mock).mockResolvedValue([mockGroup]);

      const response = await request(app).get("/searchGroups/123/Group");

      expect(response.status).toBe(200);
      expect(response.body.groups).toHaveLength(1);
      expect(response.body.groups[0].name).toBe("Group 1");
    });

    it("should return error if group search fails", async () => {
      (User.findById as jest.Mock).mockResolvedValue({ _id: "123" });
      (Group.find as jest.Mock).mockRejectedValue(new Error("Erro ao realizar a busca."));

      const response = await request(app).get("/searchGroups/123/Group");

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao realizar a busca.");
    });

    it("should return error if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/searchGroups/123/Group");

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao realizar a busca.");
    });
  });

  describe("DELETE /groups/:groupId/:userId", () => {
    it("should delete a group successfully", async () => {
      const mockUser = { _id: "123", name: "User 1" };
      const mockGroup = { _id: "groupId", name: "Group 1", userId: "123" };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Group.findOneAndDelete as jest.Mock).mockResolvedValue(mockGroup);
      (Note.deleteMany as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete("/groups/groupId/123");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Grupo e suas notas excluídos com sucesso!");
    });


    it("should return error if group not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue({ _id: "123" });
      (Group.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete("/groups/nonExistentGroupId/123");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Grupo não encontrado.");
    });

    it("should return error if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete("/groups/groupId/123");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Usuário não encontrado.");
    });

    it("should return an error if there is an issue with deleting related notes", async () => {
      const mockUser = { _id: "123", name: "User 1" };
      const mockGroup = { _id: "groupId", name: "Group 1", userId: "123" };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Group.findOneAndDelete as jest.Mock).mockResolvedValue(mockGroup);
      (Note.deleteMany as jest.Mock).mockRejectedValue(new Error("Erro ao excluir o grupo."));

      const response = await request(app).delete("/groups/groupId/123");

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao excluir grupo.");
    });

    
    

  });

});
