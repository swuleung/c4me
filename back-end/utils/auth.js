/**
 * JWT generation and verification
 */
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { getPathConfig } = require('./readAppFiles');

/**
 * Generate token with the username as body
 * @param {string} username
 */
exports.generateKey = (username) => {
    const path = getPathConfig();
    const privateKey = fs.readFileSync(`${__dirname}/${path.ASSETS}/${path.PRIVATE_KEY}`).toString();
    return jwt.sign(
        {
            username: username,
        },
        privateKey,
        {
            algorithm: 'RS256',
            expiresIn: '7 days',
        },
    );
};

/**
 * Validate a token by decrypting and returning the username
 * @param {string} accessToken
 */
exports.validateJWT = async (accessToken) => {
    const path = getPathConfig();
    const publicKey = fs.readFileSync(`${__dirname}/${path.ASSETS}/${path.PUBLIC_KEY}`).toString();
    try {
        return jwt.verify(accessToken, publicKey, {
            algorithms: ['RS256'],
        });
    } catch (e) {
        return {
            error: 'Invalid JWT',
            reason: e,
        };
    }
};
