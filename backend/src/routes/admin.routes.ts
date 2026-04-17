import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../application/authMiddleware';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { broadcastUserUpdate } from '../socket';

const router = Router();
const userRepo = new UserRepository();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', async (req, res) => {
    try {
        const users = await userRepo.findAllUsers();
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (role !== 'user' && role !== 'admin') {
            return res.status(400).json({ error: "Invalid role" });
        }
        const updatedUser = await userRepo.updateRole(req.params.id, role);
        broadcastUserUpdate();
        res.json(updatedUser);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
