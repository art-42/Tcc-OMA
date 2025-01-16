import { Request, Response } from "express";
import Note from "../models/Note";
import Group from "../models/Group";
import { gridFSBucket,connectDB } from "../config/db";
import mongoose from "mongoose";
import User from "../models/User";


export const addNoteToGroup = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, fileName, type, groupId, content } = req.body;

    // Validações obrigatórias
    if (!title || !type || !groupId || !content) {
      return res.status(400).json({ error: "Título, tipo, groupId e conteúdo são obrigatórios." });
    }

    if (!["texto", "arquivo"].includes(type)) {
      return res.status(400).json({ error: "Tipo inválido. Deve ser 'texto' ou 'arquivo'." });
    }

    const newNote = new Note({
      title,
      content, // Conteúdo enviado pelo front (já em Base64 para arquivos ou texto simples)
      fileName, // Nome do arquivo
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

    // Directly return the existing Base64 content
    res.status(200).json({
      filename: note.title,
      content: note.content,  // The Base64-encoded content directly from the database
    });
  } catch (error) {
    console.error("Erro ao fazer o download da nota:", error);
    res.status(500).json({ error: "Erro ao fazer o download da nota" });
  }
};


export const viewNote = async (req: Request, res: Response) => {
  // Atualizar base64 e retornar fileName
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

    // Retornar base64 e fileName
    res.json({ fileName: note.fileName, content: note.content });
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

    // Verifica se é do tipo 'texto' ou 'imagem' e ajusta o conteúdo
    if (note.type === "texto") {
      res.status(200).json(note);  // Retorna a nota completa com o conteúdo
    } else if (note.type === "arquivo" || note.type === "imagem") {
      // Para 'arquivo' ou 'imagem', não retorna o conteúdo em base64 aqui
      const noteData = { 
        ...note.toObject(),
        content: undefined, // Não retorna o base64 aqui
      };
      res.status(200).json(noteData);
    }

  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar anotação." });
  }
};


export const saveFileUri = async (req: Request, res: Response) => {
  try {
    const { noteId, fileUri } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }

    note.fileUri = fileUri;
    await note.save();

    res.status(200).json({ message: "URI do arquivo salva com sucesso", fileUri });
  } catch (error) {
    console.error("Erro ao salvar URI do arquivo:", error);
    res.status(500).json({ error: "Erro ao salvar URI do arquivo" });
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
    if (content) note.content = content;

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
      return res.status(404).json({ message: "Nenhuma nota encontrada para este grupo ou usuário" });
    }

    // Ajusta o retorno para não incluir o conteúdo base64 para notas do tipo "imagem" ou "arquivo"
    const formattedNotes = notes.map(note => {
      if (note.type === "texto") {
        return note; // Retorna o conteúdo completo para notas de texto
      }
      // Para "arquivo" ou "imagem", não retorna o content
      return {
        ...note.toObject(),
        content: undefined,
      };
    });

    res.status(200).json(formattedNotes);
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
