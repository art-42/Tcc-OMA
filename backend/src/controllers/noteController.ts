import { Request, Response } from "express";
import Note from "../models/Note";
import Group from "../models/Group";
import { gridFSBucket,connectDB } from "../config/db";
import mongoose from "mongoose";
import User from "../models/User";


export const addNoteToGroup = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, type, groupId } = req.body;

    if (!title || !type || !groupId) {
      return res.status(400).json({ error: "Título, tipo e groupId são obrigatórios." });
    }

    if (!["texto", "arquivo"].includes(type)) {
      return res.status(400).json({ error: "Tipo inválido. Deve ser 'texto' ou 'arquivo'." });
    }

    let processedContent;

    if (type === "arquivo") {
      if (!req.file) {
        return res.status(400).json({ error: "Um arquivo é obrigatório para o tipo 'arquivo'." });
      }

      // Converte o arquivo recebido para base64
      processedContent = req.file.buffer.toString("base64");
    } else {
      if (!req.body.content) {
        return res.status(400).json({ error: "O campo 'content' é obrigatório para notas de texto." });
      }

      processedContent = req.body.content; // Salva diretamente o texto
    }

    const newNote = new Note({
      title,
      content: processedContent,
      type,
      groupId,
      userId,
      date: new Date(),
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Erro ao criar a nota:", error);
    res.status(500).json({ error: "Erro ao criar a nota" });
  }
};

export const getNoteFileDownload = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }

    if (note.type !== "arquivo") {
      return res.status(400).json({ error: "Esta nota não é do tipo 'arquivo'." });
    }

    const fileBuffer = Buffer.from(note.content as string, "base64");

    res.set({
      "Content-Disposition": `attachment; filename="${note.title}"`,
      "Content-Type": "application/octet-stream",
    });

    res.send(fileBuffer);
  } catch (error) {
    console.error("Erro ao fazer o download da nota:", error);
    res.status(500).json({ error: "Erro ao fazer o download da nota" });
  }
};

export const viewNote = async (req: Request, res: Response) => {
  try {
    const { userId, noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }

    if (note.type !== "arquivo") {
      return res.status(400).json({ error: "Esta nota não é do tipo 'arquivo'." });
    }

    const fileBuffer = Buffer.from(note.content as string, "base64");

    res.set({
      "Content-Type": "application/octet-stream",
    });

    res.send(fileBuffer);
  } catch (error) {
    console.error("Erro ao visualizar a nota:", error);
    res.status(500).json({ error: "Erro ao visualizar a nota" });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { userId, noteId } = req.params;

    const note = await Note.findOne({ _id: noteId, userId }).populate("groupId", "name");
    if (!note) return res.status(404).json({ error: "Anotação não encontrada ou não pertence ao usuário." });

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar anotação." });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const { userId, noteId } = req.params;
    const { title, type, content } = req.body; 

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ message: "Nota não encontrada ou não pertence ao usuário" });
    }

    if (type && !["texto", "arquivo"].includes(type)) {
      return res.status(400).json({ error: "Tipo inválido. Deve ser 'texto' ou 'arquivo'." });
    }

    if (title) note.title = title;
    if (type) note.type = type;

    if (content) {
      if (note.type === "arquivo") {
        note.content = Buffer.from(content, "binary").toString("base64");
      } else {
        note.content = content;
      }
    }

    await note.save(); 

    res.status(200).json(note);
  } catch (error) {
    console.error("Erro ao atualizar a nota:", error);
    res.status(500).json({ error: "Erro ao atualizar a nota" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { userId, noteId } = req.params;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) return res.status(404).json({ error: "Anotação não encontrada ou não pertence ao usuário." });

    res.status(200).json({ message: "Anotação deletada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar anotação." });
  }
};

export const getNotesByGroup = async (req: Request, res: Response) => {
  try {
    const { userId, groupId } = req.params; 

    const notes = await Note.find({ userId, groupId });

    if (!notes || notes.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhuma nota encontrada para este grupo ou usuário" });
    }

    res.status(200).json(notes);
  } catch (error) {
    console.error("Erro ao buscar notas por grupo:", error);
    res.status(500).json({ error: "Erro ao buscar notas por grupo" });
  }
};

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const notes = await Note.find({ userId });

    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "Nenhuma nota encontrada para este usuário" });
    }

    res.status(200).json(notes);
  } catch (error) {
    console.error("Erro ao buscar as notas:", error);
    res.status(500).json({ error: "Erro ao buscar as notas" });
  }
};

export const searchNote = async (req: Request, res: Response) => {
  try {
    const { userId, query } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "O ID do usuário é obrigatório." });
    }

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "O termo de busca é obrigatório." });
    }

    const notes = await Note.find({
      userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ]
    });
   
    const result = {
      notes
    };

    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao realizar a busca geral:", err);
    res.status(500).json({ error: "Erro ao realizar a busca." });
  }
};
