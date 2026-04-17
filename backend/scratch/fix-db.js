const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/moodsnap_node');
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const usersCollection = collections.find(c => c.name === 'users');

        if (usersCollection) {
            console.log('Dropping users collection to clear old schema indexes...');
            await mongoose.connection.db.dropCollection('users');
            console.log('Users collection dropped.');
        } else {
            console.log('Users collection not found.');
        }

        await mongoose.disconnect();
        console.log('Disconnected.');
    } catch (err) {
        console.error('Error fixing database:', err);
    }
}

fixDatabase();
