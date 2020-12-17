const { HttpStatusCode } = require('../helpers/http');

const ErrorName = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    UNABLE_TO_LOGIN: 'UNABLE_TO_LOGIN',
    INVALID_REQUEST: 'INVALID_REQUEST',
    LEXICON_NOT_FOUND: 'LEXICON_NOT_FOUND',
    MISSING_BODY_PROPS: 'MISSING_BODY_PROPS',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    INVALID_RATING_VALUE: 'INVALID_RATING_VALUE',
    INVALID_USER_PASSWORD: 'INVALID_USER_PASSWORD',
    LEXICON_ALREADY_EXISTS: 'LEXICON_ALREADY_EXISTS'
}

class ApiError extends Error {
    constructor(name, message, httpStatusCode) {
        super();
        this.name = name;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
        this.isUseful = true;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            httpStatusCode: this.httpStatusCode,
            isUseful: this.isUseful
        }
    }
}

class UnableToLoginError extends ApiError {
    constructor() {
        super();
        this.name = ErrorName.UNABLE_TO_LOGIN;
        this.message = 'Email or password is invalid.';
        this.httpStatusCode = HttpStatusCode.BAD_REQUEST;
    }
}

class UserAlreadyExistsError extends ApiError {
    constructor() {
        super();
        this.name = ErrorName.USER_ALREADY_EXISTS;
        this.message = 'User already exists.';
        this.httpStatusCode = HttpStatusCode.BAD_REQUEST;
    }
}

class InvalidTokenError extends ApiError {
    constructor() {
        super();
        this.name = ErrorName.INVALID_TOKEN;
        this.message = 'Invalid token.';
        this.httpStatusCode = HttpStatusCode.BAD_REQUEST;
    }
}

class InvalidUserPasswordError extends ApiError {
    constructor() {
        super();
        this.name = ErrorName.INVALID_USER_PASSWORD;
        this.message = 'Invalid user password.';
        this.httpStatusCode = HttpStatusCode.BAD_REQUEST;
    }
}

class UnauthorizedError extends ApiError {
    constructor() {
        super();
        this.name = ErrorName.UNAUTHORIZED;
        this.message = 'Unauthorized.';
        this.httpStatusCode = HttpStatusCode.UNAUTHORIZED;
    }
}

class MissingBodyPropsError extends ApiError {
    constructor(missingProps) {
        super();
        this.name = ErrorName.MISSING_BODY_PROPS;
        this.message = `Missing body properties => ${missingProps.join(', ')}`;
        this.httpStatusCode = HttpStatusCode.BAD_REQUEST;
    }
}

class InvalidRatingValue extends ApiError {
    constructor() {
        super();
        this.name = ErrorName.INVALID_RATING_VALUE;
        this.message = 'Invalid rating value.';
        this.httpStatusCode = HttpStatusCode.BAD_REQUEST;
    }
}

class LexiconAlreadyExists extends ApiError {
    constructor() {
        super();
        this.name = ErrorName.LEXICON_ALREADY_EXISTS;
        this.message = 'Lexicon word already exists.';
        this.httpStatusCode = HttpStatusCode.BAD_REQUEST;
    }
}

class LexiconNotFound extends ApiError {
    constructor() {
        super();
        this.name = ErrorName.LEXICON_NOT_FOUND;
        this.message = 'Lexicon not found.';
        this.httpStatusCode = HttpStatusCode.NOT_FOUND;
    }
}

class InvalidRequest extends ApiError {
    constructor() {
        super();
        this.name = ErrorName.INVALID_REQUEST;
        this.message = 'Invalid request.';
        this.httpStatusCode = HttpStatusCode.BAD_REQUEST;
    }
}

module.exports = {
    ApiError,
    ErrorName,
    InvalidRequest,
    LexiconNotFound,
    UnauthorizedError,
    InvalidTokenError,
    InvalidRatingValue,
    UnableToLoginError,
    LexiconAlreadyExists,
    MissingBodyPropsError,
    UserAlreadyExistsError,
    InvalidUserPasswordError
};