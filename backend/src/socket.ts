import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { MoodRepository } from './infrastructure/repositories/MoodRepository';

let io: Server;
const moodRepo = new MoodRepository();

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    console.log("Socket.io initialized");

    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);
        
        // Push initial global stats
        moodRepo.getStats().then(stats => {
            socket.emit('globalStatsUpdate', stats);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });
    });
};

export const broadcastStatsUpdate = async () => {
    if (io) {
        const stats = await moodRepo.getStats();
        io.emit('globalStatsUpdate', stats);
    }
};

export const broadcastUserUpdate = () => {
    if (io) {
        io.emit('usersUpdated');
    }
};
