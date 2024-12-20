import { Request, Response } from "express";
import Note from "../models/Note";
import Group from "../models/Group";

interface AuthenticatedRequest extends Request {
    user?: { id: string };
  }

export const addNoteToGroup = async (req: Request, res: Response) => {
  try {
    const { groupId, title, content } = req.body;
    const note = new Note({ groupId, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar anotação ao grupo." });
  }
};


export const createNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { groupId, title, content } = req.body;
      const userId = req.user?.id;
  
      if (!title) return res.status(400).json({ error: "O título é obrigatório." });
  
      // Verificar se o grupo pertence ao usuário
      const group = await Group.findOne({ _id: groupId, userId });
      if (!group) return res.status(404).json({ error: "Grupo não encontrado ou não pertence ao usuário." });
  
      const note = new Note({ groupId, title, content, userId });
      await note.save();
  
      res.status(201).json(note);
    } catch (err) {
      res.status(500).json({ error: "Erro ao criar anotação." });
    }
  };
  
  // 2. Buscar nota por ID
  export const getNoteById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
  
      const note = await Note.findOne({ _id: id, userId }).populate("groupId", "name");
      if (!note) return res.status(404).json({ error: "Anotação não encontrada." });
  
      res.status(200).json(note);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar anotação." });
    }
  };
  
  // 3. Atualizar anotação
  export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, content, groupId } = req.body;
      const userId = req.user?.id;
  
      // Verificar se o grupo pertence ao usuário (se foi alterado)
      if (groupId) {
        const group = await Group.findOne({ _id: groupId, userId });
        if (!group) return res.status(404).json({ error: "Grupo não encontrado ou não pertence ao usuário." });
      }
  
      const note = await Note.findOneAndUpdate(
        { _id: id, userId },
        { title, content, groupId },
        { new: true }
      );
      if (!note) return res.status(404).json({ error: "Anotação não encontrada." });
  
      res.status(200).json(note);
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar anotação." });
    }
  };
  
  // 4. Deletar anotação
  export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
  
      const note = await Note.findOneAndDelete({ _id: id, userId });
      if (!note) return res.status(404).json({ error: "Anotação não encontrada." });
  
      res.status(200).json({ message: "Anotação deletada com sucesso." });
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar anotação." });
    }
  };
  
  // 5. Buscar anotações por grupo
  export const getNotesByGroup = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { groupId } = req.params;
      const userId = req.user?.id;
  
      const group = await Group.findOne({ _id: groupId, userId });
      if (!group) return res.status(404).json({ error: "Grupo não encontrado ou não pertence ao usuário." });
  
      const notes = await Note.find({ groupId, userId });
      res.status(200).json(notes);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar anotações do grupo." });
    }
  };
  
  // 6. Listar todas as anotações do usuário
  export const getAllNotes = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
  
      const notes = await Note.find({ userId }).populate("groupId", "name");
      res.status(200).json(notes);
    } catch (err) {
      res.status(500).json({ error: "Erro ao listar anotações." });
    }
  };