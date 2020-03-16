/**
 * JWT generation and verification
 */
const jwt = require("jsonwebtoken");
const fs = require("fs");
const publicKey = fs.readFileSync(__dirname + '/c4meJWT.pub').toString();
const privateKey = fs.readFileSync(__dirname + '/c4meJWT').toString();

exports.generateKey = (username) => {
    return jwt.sign(
        {
            username: username
        },
        privateKey,
        {
            expiresIn: "1 day"
        }
    );
}

exports.validateJWT = (access_token) => {
    return jwt.verify(access_token, publicKey, {
        algorithms: ["RS256"]
    });
}
