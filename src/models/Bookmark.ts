import mongoose, {
  Schema,
  model,
  models,
  Document,
  Model,
  Types,
} from 'mongoose';

export interface IBookmark extends Document {
  News: Types.ObjectId;
  User: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    News: {
      type: Schema.Types.ObjectId,
      ref: 'News',
      required: true,
    },
    User: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Bookmark: Model<IBookmark> =
  models.Bookmark || model<IBookmark>('Bookmark', bookmarkSchema);

export default Bookmark;
