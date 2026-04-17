import { Router } from 'express';
import { AuthService } from '../application/AuthService';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const tokens = await authService.register(name, email, password);
        let userRole = 'user';
        res.json({ ...tokens, role: userRole });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const tokens = await authService.login(email, password);
        // We will send role as well to frontend for convenience, we could also parse the JWT.
        // Quick way: parse the access token to get role
        const payload = JSON.parse(Buffer.from(tokens.accessToken.split('.')[1], 'base64').toString());
        res.json({ ...tokens, role: payload.role });
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
});

router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: "No token provided" });
        const tokens = await authService.refresh(refreshToken);
        res.json(tokens);
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
});

export default router;
