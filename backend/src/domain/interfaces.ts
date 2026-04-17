import mongoose from 'mongoose';

export interface IUser {
    id?: string;
    name?: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    refreshToken?: string;
}

export interface IMood {
    id?: string;
    userId: string | IUser;
    mood: 'happy' | 'sad' | 'neutral' | 'angry';
    note?: string;
    createdAt?: Date;
}
