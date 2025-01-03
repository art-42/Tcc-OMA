import mongoose, { Schema, Document } from "mongoose";

interface INote extends Document {
  title: string;
  userId: string;
  content: string;
  groupId: string; 
  date: Date;
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true},
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  date: { type: Date, required: true, default: Date.now },
});

export default mongoose.model<INote>("Note", NoteSchema);
