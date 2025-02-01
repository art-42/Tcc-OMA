import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string; 
  type: "texto" | "arquivo" | "foto" | "desenho";
  groupId: string;
  userId: string;
  date: Date;
  fileName?: string;
  fileUri?: string;
  tag?:string
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, 
  type: { type: String, enum: ["texto", "arquivo", "foto", "desenho"], required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  fileName: { type: String },
  fileUri: { type: String },
  tag: { type: String },
});

export default mongoose.model<INote>("Note", NoteSchema);

