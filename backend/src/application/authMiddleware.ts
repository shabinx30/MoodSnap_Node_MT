import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';

export interface AuthRequest extends Request {
    user?: { id: string, role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): any => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string, role: string };
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): any => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
};
