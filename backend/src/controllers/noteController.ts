import { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import path from "path";
import PDFDocument from "pdfkit";
import sharp from "sharp";

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


export const generatePdfEndpoint = async (req: Request, res: Response) => {
  const { userId, groupId } = req.params;
  const { download } = req.query;

  try {
    
    const notes = await Note.find({ userId, groupId });

    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "Nenhuma nota encontrada." });
    }

    const doc = new PDFDocument({ autoFirstPage: false });

    const exportsDir = path.resolve(__dirname, "../exports");
    const filePath = path.join(exportsDir, `group_${groupId}.pdf`);

    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    if (download === "true") {
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      await addNotesToPdf(doc, notes);

      doc.end();

      writeStream.on("finish", () => {
        res.download(filePath, `group_${groupId}.pdf`, () => {
          fs.unlinkSync(filePath);
        });
      });
    } else {
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);

      await addNotesToPdf(doc, notes);

      doc.end();
    }
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).json({ message: "Erro ao gerar PDF das notas." });
  }
};

const addDownloadLink = (doc: PDFKit.PDFDocument, note: any) => {
  const downloadLink = `http://localhost:5001/notes/download/${note._id}`;
  doc.fontSize(12).fillColor("blue").text("Clique aqui para baixar o conteúdo", {
    link: downloadLink,
    underline: true,
  });
};

const addNotesToPdf = async (doc: PDFKit.PDFDocument, notes: any[]) => {
  for (const note of notes) {

    doc.addPage();
    doc.fontSize(16).text(`Título: ${note.title}`, { underline: true });
    doc.moveDown();
    
    if (note.type === "texto") {
      doc.fontSize(12).text(note.content);
    } else if (note.type === "foto" || note.type === "desenho" || note.type === "arquivo") {
      try {
        
        let imageBuffer: Buffer;
        

        if (note.content instanceof Buffer) {
          imageBuffer = note.content;
        } else if (typeof note.content === "string") {
          imageBuffer = Buffer.from(note.content, "base64");
        } else {
          throw new Error("Formato de imagem não suportado.");
        }

        const convertedBuffer = await convertToSupportedImage(imageBuffer);

        doc.image(convertedBuffer, {
          fit: [500, 400],
          align: "center",
          valign: "center",
        });
      } catch (err) {
        console.error(`Erro ao adicionar imagem no PDF: ${err}`);
        addDownloadLink(doc, note);
      }
    } 
  }
};



export const downloadNote = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Nota não encontrada." });
    }

    const contentBuffer = Buffer.from(note.content, "base64");
    const fileName = note.fileName || "download";

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(contentBuffer);
  } catch (error) {
    console.error("Erro ao baixar nota:", error);
    res.status(500).json({ message: "Erro ao baixar a nota." });
  }
};


const convertToSupportedImage = async (input: Buffer | string): Promise<Buffer> => {
  try {
    let imageBuffer: Buffer;

    if (typeof input === "string") {
      if (input.startsWith("data:image")) {
        const base64Data = input.split(",")[1]; 
        imageBuffer = Buffer.from(base64Data, "base64");
      } else {
        imageBuffer = Buffer.from(input, "base64");
      }
    } else {
      imageBuffer = input;
    }
    return await sharp(imageBuffer).png().toBuffer();
  } catch (err) {
    throw new Error("Erro ao converter imagem para formato suportado.");
  }
};
