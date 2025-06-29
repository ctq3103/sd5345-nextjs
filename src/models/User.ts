import mongoose, { Schema, model, models, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  image: string;
  role: 'user' | 'admin' | 'superAdmin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['user', 'admin', 'superAdmin'],
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = models.User || model<IUser>('User', userSchema);

export default User;
