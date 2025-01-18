import mongoose, { Schema, Document } from "mongoose";

interface INote extends Document {
  title: string;
  content: string; 
  type: "texto" | "arquivo";
  groupId: string;
  userId: string;
  date: Date;
  fileName?: string;
  fileUri?: string;
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, 
  type: { type: String, enum: ["texto", "arquivo", "foto"], required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  fileName: { type: String },
  fileUri: { type: String },
});

export default mongoose.model<INote>("Note", NoteSchema);

