import { Request, Response } from "express";
import Note from "../models/Note";
import Group from "../models/Group";
import { gridFSBucket,connectDB } from "../config/db";
import mongoose from "mongoose";
import User from "../models/User";


export const addNoteToGroup = async (req: Request, res: Response) => {
  try {

    const { userId } = req.params;
    const { title, type, groupId, content, fileName, tag } = req.body; 
    let finalFileName = null;

    if (!title || !type || !groupId || !content) {
      return res.status(400).json({ error: "Título, tipo, groupId e conteúdo são obrigatórios." });
    }

    if (!["texto", "arquivo", "foto", "desenho"].includes(type)) {
      return res.status(400).json({ error: "Tipo inválido. Deve ser 'texto', 'arquivo', 'foto' ou 'desenho." });
    }


    if (type === "arquivo") {
      if (!fileName) {
        return res.status(400).json({ error: "Nome do arquivo é obrigatório para o tipo 'arquivo'." });
      }
      finalFileName = fileName; 
    }

    const newNote = new Note({
      title,
      content, 
      fileName: finalFileName,
      type,
      groupId,
      userId,
      tag,
      date: new Date(),
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Erro ao criar a nota:", error);
    res.status(500).json({ error: "Erro ao criar a nota" });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {

    const { userId, noteId } = req.params;

    const note = await Note.findOne({ _id: noteId, userId }).populate("groupId", "name");
    if (!note) return res.status(404).json({ error: "Anotação não encontrada ou não pertence ao usuário." });


    if (note.type === "texto" || "arquivo" || "foto") {
      res.status(200).json(note);  
    }

  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar anotação." });
  }
};

export const saveFileUri = async (req: Request, res: Response) => {
  try {
    const {userId, noteId} = req.params;
    const { fileUri } = req.body;

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
    const { title, type, content, fileName, tag} = req.body; 

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ message: "Nota não encontrada ou não pertence ao usuário" });
    }

    if (type && !["texto", "arquivo", "foto", "desenho"].includes(type)) {
      return res.status(400).json({ error: "Tipo inválido. Deve ser 'texto', 'arquivo', 'foto' ou desenho." });
    }

    if (title) note.title = title;
    if (type) note.type = type;
    if (content) note.content = content;
    if (fileName) note.fileName = fileName;
    if (tag) note.tag = tag;

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

    const formattedNotes = notes.map(note => {
      if (note.type === "texto") {
        return note; 
      }
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

    // Inicializa um array de resultados
    let notes: any[] = [];

    // Busca para notas do tipo "texto" (no title e content)
    const textNotes = await Note.find({
      userId,
      type: "texto",
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ]
    });

    // Busca para notas de outros tipos (no title e tag)
    const otherNotes = await Note.find({
      userId,
      type: { $ne: "texto" },  // Notas que não sejam do tipo "texto"
      $or: [
        { title: { $regex: query, $options: "i" } },
        { tag: { $regex: query, $options: "i" } }
      ]
    });

    // Juntando os resultados
    notes = [...textNotes, ...otherNotes];

    // Resultado
    const result = {
      notes
    };

    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao realizar a busca geral:", err);
    res.status(500).json({ error: "Erro ao realizar a busca." });
  }
};



export const addTagNote = async (req: Request, res: Response) => {
  try {
    const { userId, noteId } = req.params;
    const { tag } = req.body;

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ message: "Nota não encontrada ou não pertence ao usuário." });
    }

    if (tag && tag.trim() !== "") {
      note.tag = tag;
    } else if (!tag) {
      return res.status(400).json({ message: "A tag não pode ser vazia." });
    }

    await note.save();

    res.status(200).json({
      message: "Tag adicionada com sucesso.",
      note,
    });
  } catch (error) {
    console.error("Erro ao atualizar a nota:", error);
    res.status(500).json({ error: "Erro ao atualizar a nota." });
  }
};
