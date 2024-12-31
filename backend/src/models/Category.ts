import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  userId: string;
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ICategory>("Category", CategorySchema);
