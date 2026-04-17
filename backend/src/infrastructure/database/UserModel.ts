import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../../domain/interfaces';

export interface UserDocument extends Omit<IUser, 'id'>, Document {}

const UserSchema: Schema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshToken: { type: String }
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
