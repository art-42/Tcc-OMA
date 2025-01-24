import { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import path from "path";


const fs = require("fs");

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
    
    note.tag = tag;

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
    console.error("Erro ao buscar as notas:", error);
    res.status(500).json({ error: "Erro ao buscar as notas" });
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


export const generatePdfMock = (req: Request, res: Response) => {

  const pdfPath = path.resolve(__dirname, "../mock/mock.pdf");
  const pdfBase64 = fs.readFileSync(pdfPath, { encoding: "base64" });

  console.log(pdfBase64);

  res.status(200).json({
    success: true,
    message: "PDF gerado com sucesso (mock)",
    pdfBase64: pdfBase64,
  });
};