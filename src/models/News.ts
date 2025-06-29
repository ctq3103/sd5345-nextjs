import mongoose, {
  Schema,
  model,
  models,
  Document,
  Model,
  Types,
} from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  viewsCount: number;
  thumbnailURL: string;
  author: Types.ObjectId;
  categories: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    viewsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    thumbnailURL: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
  },
  { timestamps: true }
);

const News: Model<INews> = models.News || model<INews>('News', newsSchema);

export default News;
