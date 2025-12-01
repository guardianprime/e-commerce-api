import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<IUser>("User", userSchema);
