const { log } = require('console')
const crypto = require('crypto')

const hashPassword = (input) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const hashedPassword = crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha1').toString('hex')

    return {
        salt,
        hashedPassword
    }
}

const hashPasswordWithSalt = (input, salt) => {
    console.log(input, salt);
    const hashedPassword = crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha1').toString('hex');
    return hashedPassword;
};

module.exports = {
    hashPassword,
    hashPasswordWithSalt
}