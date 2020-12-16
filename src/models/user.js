const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        minlength: 7,
        trim: true
    },
    accessTokens: [{
        accessToken: {
            type: String,
            required: true
        }
    }],
    refreshTokens: [{
        refreshToken: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true,
    id: false,
    toObject: {
        virtuals: true,
        versionKey: false
    }
});

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.accessTokens;
    delete userObject.refreshTokens;

    return userObject;
}

userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const accessToken = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, { expiresIn: (60 * 60) * 1 }); // 1h

    user.accessTokens = user.accessTokens.concat({ accessToken });
    await user.save();

    return accessToken;
}

userSchema.methods.generateRefreshToken = async function () {
    const user = this;
    const refreshToken = jwt.sign({ _id: user._id.toString() }, process.env.SECRET);

    user.refreshTokens = user.refreshTokens.concat({ refreshToken });
    await user.save();

    return refreshToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;