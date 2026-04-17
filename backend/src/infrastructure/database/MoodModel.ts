import mongoose, { Schema, Document } from 'mongoose';
import { IMood } from '../../domain/interfaces';

export interface MoodDocument extends Omit<IMood, 'id'>, Document {}

const MoodSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, enum: ['happy', 'sad', 'neutral', 'angry'], required: true },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

export const MoodModel = mongoose.model<MoodDocument>('Mood', MoodSchema);
