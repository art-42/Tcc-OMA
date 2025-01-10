import { Request, Response } from "express";
import Note from "../models/Note";
import Group from "../models/Group";
import { gridFSBucket,connectDB } from "../config/db";
import mongoose from "mongoose";


export const addNoteToGroup = async (req: Request, res: Response) => {
  try {
    console.log("Dados recebidos:", req.body);
    const { userId } = req.params;
    const { title, type, groupId } = req.body;
    

    if (!["texto", "arquivo"].includes(type)) {
      return res.status(400).json({ error: "Tipo de anotação inválido. Deve ser 'text' ou 'file'." });
    }

    if (!gridFSBucket) {
      throw new Error("GridFSBucket não foi inicializado.");
    }

    let content: string | undefined;

    if (type === "texto") {
      content = req.body.content;
      if (!content) {
        return res.status(400).json({ error: "Conteúdo textual é obrigatório para anotações do tipo 'text'." });
      }
    } else if (type === "arquivo") {
      const file = (req as any).file;

      if (!file || !file.buffer) {
        return res.status(400).json({ error: "Arquivo é obrigatório para anotações do tipo 'arquivo'." });
      }

      // Salvar arquivo no GridFS
      const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      // Usar `end` para enviar os dados
      uploadStream.end(file.buffer);

      // Aguarda o término do salvamento do arquivo
      const uploadResult = await new Promise<string>((resolve, reject) => {
        uploadStream.on("finish", () => {
          resolve(uploadStream.id.toString()); // Retorna o ID do arquivo salvo no GridFS
        });

        uploadStream.on("error", (err) => {
          console.error("Erro ao salvar o arquivo no GridFS:", err);
          reject(new Error("Erro ao salvar o arquivo no GridFS."));
        });
      });

      content = uploadResult;
    }

    if (!content) {
      return res.status(500).json({ error: "Erro interno ao processar o conteúdo da anotação." });
    }

    // Salva a anotação no banco de dados
    const note = new Note({
      title,
      content,
      type,
      groupId,
      userId
      
    });

    await note.save();

    res.status(201).json({ message: "Anotação adicionada com sucesso.", note });
  } catch (err) {
    console.error("Erro ao adicionar anotação:", err);
    res.status(500).json({ error: "Erro ao adicionar anotação ao grupo." });
  }
};

export const getNoteFile = async (req: Request, res: Response) => {
  try {
    const { noteId,userId } = req.params; // A nota que você quer recuperar o arquivo

    // Recupera a nota pelo ID
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Nota não encontrada." });
    }

    if (note.type !== "arquivo") {
      return res.status(400).json({ error: "Esta nota não contém um arquivo." });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ error: "Você não tem permissão para acessar esse arquivo." });
    }


    const fileId = new mongoose.Types.ObjectId(note.content);

    const downloadStream = gridFSBucket.openDownloadStream(fileId);


    res.setHeader("Content-Type", "application/octet-stream"); 
    downloadStream.pipe(res);

    downloadStream.on("error", (err) => {
      console.error("Erro ao recuperar o arquivo do GridFS:", err);
      res.status(500).json({ error: "Erro ao recuperar o arquivo." });
    });
  } catch (err) {
    console.error("Erro ao recuperar arquivo da nota:", err);
    res.status(500).json({ error: "Erro ao recuperar arquivo da nota." });
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
    const { title, content, groupId } = req.body;

    // Verificar se o grupo existe (se foi alterado)
    if (groupId) {
      const group = await Group.findOne({ _id: groupId, userId });
      if (!group) return res.status(404).json({ error: "Grupo não encontrado ou não pertence ao usuário." });
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content, groupId },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Anotação não encontrada ou não pertence ao usuário." });

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar anotação." });
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

    const group = await Group.findOne({ _id: groupId, userId });
    if (!group) return res.status(404).json({ error: "Grupo não encontrado ou não pertence ao usuário." });

    const notes = await Note.find({ userId }).populate("groupId", "name");
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar anotações do grupo." });
  }
};

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const notes = await Note.find({ userId }).populate("groupId", "name");
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar anotações." });
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
