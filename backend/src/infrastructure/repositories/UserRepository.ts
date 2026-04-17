import { IUser } from '../../domain/interfaces';
import { UserModel, UserDocument } from '../database/UserModel';

export class UserRepository {
    async findByEmail(email: string): Promise<UserDocument | null> {
        return UserModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id).exec();
    }

    async create(user: Partial<IUser>): Promise<UserDocument> {
        const newUser = new UserModel(user);
        return newUser.save();
    }

    async updateRefreshToken(id: string, token: string | null): Promise<void> {
        await UserModel.findByIdAndUpdate(id, { refreshToken: token }).exec();
    }

    async updateRole(id: string, role: string): Promise<UserDocument | null> {
        return UserModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
    }

    async findAllUsers(): Promise<UserDocument[]> {
        return UserModel.find({}, { password: 0, refreshToken: 0 }).exec();
    }
}
