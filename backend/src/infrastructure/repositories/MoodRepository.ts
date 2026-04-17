import { IMood } from '../../domain/interfaces';
import { MoodModel, MoodDocument } from '../database/MoodModel';
import mongoose from 'mongoose';

export class MoodRepository {
    async create(mood: IMood): Promise<MoodDocument> {
        const newMood = new MoodModel(mood);
        return newMood.save();
    }

    async findByUserId(userId: string): Promise<MoodDocument[]> {
        return MoodModel.find({ userId }).sort({ createdAt: -1 }).populate('userId', 'name email').exec();
    }

    async findAll(): Promise<MoodDocument[]> {
        return MoodModel.find().sort({ createdAt: -1 }).populate('userId', 'name email').exec();
    }

    async getStats(userId?: string): Promise<any> {
        const match = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
        const stats = await MoodModel.aggregate([
            { $match: match },
            { $group: { _id: "$mood", count: { $sum: 1 } } }
        ]);
        
        const result: Record<string, number> = { happy: 0, sad: 0, neutral: 0, angry: 0 };
        stats.forEach(stat => result[stat._id as string] = stat.count);
        return result;
    }

    async getTrend(userId?: string): Promise<any> {
        // Return daily aggregated trends
        const match = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
        const pipeline = [
            { $match: match },
            { $group: {
                _id: {
                   date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                   mood: "$mood"
                },
                count: { $sum: 1 }
            }},
            { $sort: { "_id.date": 1 } }
        ] as any[];
        return MoodModel.aggregate(pipeline);
    }
}
