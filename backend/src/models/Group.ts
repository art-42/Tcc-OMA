import mongoose, { Schema, Document } from "mongoose";

export interface GroupDocument extends Document {
  name: string;
  categoryId: string; // Relacionamento com a categoria
  userId: string; // Relacionamento com o usuário
}

const GroupSchema = new Schema<GroupDocument>(
  {
    name: { type: String, required: true },
    categoryId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<GroupDocument>("Group", GroupSchema);

