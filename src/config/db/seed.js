const mongoose = require('mongoose');
require('./mongoose');

mongoose.connection.on('connected', async () => {
    mongoose.connection.dropDatabase();

    const User = require('../../models/user');
    await new User({
        name: 'Italiano',
        email: 'italiano@mailinator.com',
        password: 'italiano'
    }).save();

    console.log('--------------------------------');
    console.log('==> Successfully seeded data <==');
    console.log('--------------------------------');

    mongoose.disconnect();
});