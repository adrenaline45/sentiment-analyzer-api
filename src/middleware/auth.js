const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { HttpStatusCode } = require('../helpers/http');
const { UnauthorizedError } = require('../helpers/error');

const auth = async (req, res, next) => {
    try {
        const accessToken = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(accessToken, process.env.SECRET);
        const user = await User.findOne({ _id: decoded._id, 'accessTokens.accessToken': accessToken });

        if (!user) {
            throw new UnauthorizedError();
        }

        req.accessToken = accessToken;
        req.user = user;
        next();
    } catch (e) {
        res.status(e.httpStatusCode || HttpStatusCode.UNAUTHORIZED).send(new UnauthorizedError());
    }
}

module.exports = auth;