const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
    UnableToLoginError,
    UserAlreadyExistsError,
    InvalidTokenError
} = require('../helpers/error');
const { validateBody } = require('../helpers/route');
const { HttpStatusCode } = require('../helpers/http');

exports.login = async (req, res) => {
    try {
        validateBody(req.body, 'email', 'password');

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            throw new UnableToLoginError();
        }

        const validPassword = await user.isValidPassword(req.body.password);

        if (!validPassword) {
            throw new UnableToLoginError();
        }

        const accessToken = await user.generateAuthToken();
        const refreshToken = await user.generateRefreshToken();

        res.send({ user, accessToken, refreshToken });
    } catch (e) {
        res.status(e.httpStatusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).send(e);
    }
}

exports.register = async (req, res) => {
    try {
        validateBody(req.body, 'name', 'email', 'password');

        const userExists = await User.findOne({ email: req.body.email });

        if (userExists) {
            throw new UserAlreadyExistsError();
        }

        const user = new User(req.body);
        await user.save();

        const accessToken = await user.generateAuthToken();
        const refreshToken = await user.generateRefreshToken();

        res.status(HttpStatusCode.CREATED).send({ user, accessToken, refreshToken });
    } catch (e) {
        res.status(e.httpStatusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).send(e);
    }
}

exports.refreshToken = async (req, res) => {
    try {
        validateBody(req.body, 'refreshToken');

        const token = req.body.refreshToken;
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({ _id: decodedToken._id, 'refreshTokens.refreshToken': token });

        if (!user) {
            throw new InvalidTokenError();
        }

        user.refreshTokens = user.refreshTokens.filter(refreshToken => refreshToken.refreshToken !== token);
        await user.save();

        const accessToken = await user.generateAuthToken();
        const refreshToken = await user.generateRefreshToken();

        res.send({ accessToken, refreshToken });
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            const error = new InvalidTokenError().toJSON();
            return res.status(error.httpStatusCode).send(error);
        }

        res.status(e.httpStatusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).send(e);
    }
}

exports.getLoggedUser = (req, res) => res.send(req.user);

exports.logout = async (req, res) => {
    try {
        req.user.accessTokens = req.user.accessTokens.filter(accessToken => accessToken.accessToken !== req.accessToken);
        await req.user.save();

        res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (e) {
        res.status(e.httpStatusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).send(e);
    }
}