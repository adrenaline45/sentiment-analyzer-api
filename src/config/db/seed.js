const mongoose = require('mongoose');
require('./mongoose');

mongoose.connection.on('connected', async () => {
    mongoose.connection.dropDatabase();

    const User = require('../../models/user');
    const Lexicon = require('../../models/lexicon');

    // Seed Users
    const userId = new mongoose.Types.ObjectId().toString();
    await new User({
        _id: userId,
        name: 'Italiano',
        email: 'italiano@mailinator.com',
        password: 'italiano'
    }).save();

    // Seed Lexicons
    await new Lexicon({ word: 'nice', rating: 0.4, createdBy: userId }).save();
    await new Lexicon({ word: 'excellent', rating: 0.8, createdBy: userId }).save();
    await new Lexicon({ word: 'modest', rating: 0, createdBy: userId }).save();
    await new Lexicon({ word: 'horrible', rating: -0.8, createdBy: userId }).save();
    await new Lexicon({ word: 'ugly', rating: -0.5, createdBy: userId }).save();

    console.log('--------------------------------');
    console.log('==> Successfully seeded data <==');
    console.log('--------------------------------');

    mongoose.disconnect();
});