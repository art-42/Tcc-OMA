import mongoose, { Schema, Document } from "mongoose";

export interface GroupDocument extends Document {
  name: string;
  categoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date; 
}

const GroupSchema = new Schema<GroupDocument>(
  {
    name: { type: String, required: true },
    categoryId: { type: String, required: false },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<GroupDocument>("Group", GroupSchema);
