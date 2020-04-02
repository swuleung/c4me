/**
 * JWT generation and verification
 */
const jwt = require('jsonwebtoken');
const fs = require('fs');

const publicKey = fs.readFileSync(`${__dirname}/../assets/keys/c4meJWT.pub`).toString();
const privateKey = fs.readFileSync(`${__dirname}/../assets/keys/c4meJWT`).toString();

exports.generateKey = (username) => jwt.sign(
    {
        username: username,
    },
    privateKey,
    {
        algorithm: 'RS256',
        expiresIn: '1 day',
    },
);

exports.validateJWT = async (accessToken) => {
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
