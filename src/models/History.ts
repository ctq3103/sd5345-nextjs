import mongoose, {
  Schema,
  model,
  models,
  Document,
  Model,
  Types,
} from 'mongoose';

export interface IHistory extends Document {
  News: Types.ObjectId;
  User: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const historySchema = new Schema<IHistory>(
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

const History: Model<IHistory> = models.History || model<IHistory>('History', historySchema);

export default History;
