const { MissingBodyPropsError } = require('./error');

/**
 * Validates required properties from the Request Body
 * Needs to be called in try/catch block
 */
const validateBody = (body, ...props) => {
    const missingProps = [];

    props.forEach(prop => {
        if (!(prop in body)) {
            missingProps.push(prop);
        }
    });

    if (missingProps.length) {
        throw new MissingBodyPropsError(missingProps);
    }
}

/**
 * {{sortBy}} - sort from the client side
 * {{defaultSortBy}} - default sort if client sortBy is not provided
 * Needs to be called in try/catch block
 */
const getSortBy = (sortBy, defaultSortBy) => {
    const sort = {};

    if (!sortBy) {
        sortBy = defaultSortBy;
    }

    const parts = sortBy.split(':');

    if (!parts) {
        throw new InvalidSortByFormatError();
    }

    if (parts.length != 2) {
        parts[1] = 'asc';
    }

    sort[parts[0]] = parts[1].toLowerCase() === 'desc' ? -1 : 1;

    return sort;
}

module.exports = {
    validateBody,
    getSortBy
}