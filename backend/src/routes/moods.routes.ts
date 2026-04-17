import { Router } from 'express';
import { authMiddleware } from '../application/authMiddleware';
import { MoodRepository } from '../infrastructure/repositories/MoodRepository';
import { broadcastStatsUpdate } from '../socket';

const router = Router();
const moodRepo = new MoodRepository();

router.use(authMiddleware);

router.post('/', async (req: any, res) => {
    try {
        const { mood, note } = req.body;
        const newMood = await moodRepo.create({ userId: req.user.id, mood, note });
        await broadcastStatsUpdate();
        res.json(newMood);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req: any, res) => {
    try {
        if (req.user.role === 'admin') {
            const moods = await moodRepo.findAll();
            return res.json(moods);
        }
        const moods = await moodRepo.findByUserId(req.user.id);
        res.json(moods);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/stats', async (req: any, res) => {
    try {
        if (req.user.role === 'admin') {
            const stats = await moodRepo.getStats();
            return res.json(stats);
        }
        const stats = await moodRepo.getStats(req.user.id);
        res.json(stats);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/trend', async (req: any, res) => {
    try {
        if (req.user.role === 'admin') {
            const trend = await moodRepo.getTrend();
            return res.json(trend);
        }
        const trend = await moodRepo.getTrend(req.user.id);
        res.json(trend);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
