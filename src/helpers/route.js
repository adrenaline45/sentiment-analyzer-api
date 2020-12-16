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

module.exports = {
    validateBody
}