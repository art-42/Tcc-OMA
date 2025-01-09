import mongoose, { Schema, Document } from "mongoose";

interface INote extends Document {
  title: string;
  content: string | mongoose.Types.ObjectId;
  //fileUrl?: string; 
  type: "texto" | "arquivo"; 
  groupId: string;
  userId: string;
  date: Date;
  
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: {
    type: Schema.Types.Mixed, // Pode ser tanto uma string (para notas de texto) ou um ObjectId (para arquivos no GridFS)
    required: true,
  },
  //fileUrl: { type: String, required: function (this: INote) { return this.type === "arquivo"; } }, // Condicional baseado no tipo
  type: { type: String, enum: ["texto", "arquivo"], required: true }, // Define os valores aceitos para o tipo
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  
});

export default mongoose.model<INote>("Note", NoteSchema);
