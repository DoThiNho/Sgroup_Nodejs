const { log } = require('console')
const crypto = require('crypto')

const rawpassword = 'nho12345'

// Hash password with SHA-512 algorithm
function hashWithSHA512(input){
    const output = crypto
                    .createHash('sha512')
                    .update(input)
                    .digest('hex')
    return output
}

function hashWithRandomSalt(input){
    const salt = crypto.randomBytes(16).toString('hex')
    const output = crypto.pbkdf2Sync(
        input,
        salt,
        1000,
        64,
        'sha512',
    ).toString('hex')
    return output
}

// const hashedPassword = hashWithSHA512(password)
// console.log(hashedPassword);

const password = 'nho12345'

console.log("first time: " + hashWithRandomSalt(rawpassword));
console.log("second time: " + hashWithRandomSalt(password));
