import { UserRepository } from '../infrastructure/repositories/UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

export class AuthService {
    private userRepository = new UserRepository();

    async generateTokens(userId: string, role: string) {
        const accessToken = jwt.sign({ id: userId, role }, ACCESS_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
        await this.userRepository.updateRefreshToken(userId, refreshToken);
        return { accessToken, refreshToken };
    }

    async register(name: string, email: string, password: string) {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) throw new Error('Email already registered');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({ name, email, password: hashedPassword, role: 'user' });
        
        return this.generateTokens(user._id.toString(), user.role);
    }

    async login(email: string, password: string) {
        // Admin hardcoded check
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            let adminUser = await this.userRepository.findByEmail(email);
            if (!adminUser) {
                const hashedPassword = await bcrypt.hash(password, 10);
                adminUser = await this.userRepository.create({ name: 'Admin', email, password: hashedPassword, role: 'admin' });
            }
            return this.generateTokens(adminUser._id.toString(), adminUser.role);
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password as string))) {
            throw new Error('Invalid credentials');
        }

        return this.generateTokens(user._id.toString(), user.role);
    }

    async refresh(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as any;
            const user = await this.userRepository.findById(decoded.id);
            if (!user || user.refreshToken !== refreshToken) throw new Error('Invalid refresh token');

            return this.generateTokens(user._id.toString(), user.role);
        } catch (e) {
            throw new Error('Invalid refresh token');
        }
    }

    async logout(userId: string) {
        await this.userRepository.updateRefreshToken(userId, null);
    }
}
