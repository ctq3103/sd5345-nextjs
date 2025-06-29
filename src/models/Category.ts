import mongoose, { Schema, model, models, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  thumbnailURL: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailURL: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Category: Model<ICategory> = models.Category || model<ICategory>('Category', categorySchema);

export default Category;
