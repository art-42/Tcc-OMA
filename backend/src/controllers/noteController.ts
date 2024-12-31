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
  
  export const createNote = async (req: Request, res: Response) => {
    try {
      const { groupId, title, content } = req.body;
  
      if (!title) return res.status(400).json({ error: "O título é obrigatório." });
  
      // Verificar se o grupo existe
      const group = await Group.findOne({ _id: groupId });
      if (!group) return res.status(404).json({ error: "Grupo não encontrado." });
  
      const note = new Note({ groupId, title, content });
      await note.save();
  
      res.status(201).json(note);
    } catch (err) {
      res.status(500).json({ error: "Erro ao criar anotação." });
    }
  };
  
  export const getNoteById = async (req: Request, res: Response) => {
    try {
      const { noteId } = req.params;
  
      const note = await Note.findOne({ _id: noteId }).populate("groupId", "name");
      if (!note) return res.status(404).json({ error: "Anotação não encontrada." });
  
      res.status(200).json(note);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar anotação." });
    }
  };
  
  export const updateNote = async (req: Request, res: Response) => {
    try {
      const { noteId } = req.params;
      const { title, content, groupId } = req.body;
  
      // Verificar se o grupo existe (se foi alterado)
      if (groupId) {
        const group = await Group.findOne({ _id: groupId });
        if (!group) return res.status(404).json({ error: "Grupo não encontrado." });
      }
  
      const note = await Note.findOneAndUpdate(
        { _id: noteId },
        { title, content, groupId },
        { new: true }
      );
      if (!note) return res.status(404).json({ error: "Anotação não encontrada." });
  
      res.status(200).json(note);
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar anotação." });
    }
  };
  
  export const deleteNote = async (req: Request, res: Response) => {
    try {
      const { noteId } = req.params;
  
      const note = await Note.findOneAndDelete({ _id: noteId });
      if (!note) return res.status(404).json({ error: "Anotação não encontrada." });
  
      res.status(200).json({ message: "Anotação deletada com sucesso." });
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar anotação." });
    }
  };
  
  export const getNotesByGroup = async (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;
  
      const group = await Group.findOne({ _id: groupId });
      if (!group) return res.status(404).json({ error: "Grupo não encontrado." });
  
      const notes = await Note.find({ groupId });
      res.status(200).json(notes);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar anotações do grupo." });
    }
  };
  
  export const getAllNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find().populate("groupId", "name");
      res.status(200).json(notes);
    } catch (err) {
      res.status(500).json({ error: "Erro ao listar anotações." });
    }
  };
  