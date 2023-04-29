const crypto = require('crypto')
const key = crypto.generateKeyPairSync(
    'rsa',
    { modulusLength: 2848 },

);

const rawPassword = 'nho123456'
const publicKey = key.publicKey
const privateKey = key.privateKey

const encryptedData = crypto.publicEncrypt(
    {
        key: publicKey, 
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256"
    },
    Buffer.from(rawPassword)
).toString('base64')

const decrytedData = crypto.privateDecrypt(
    {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    },
    Buffer.from(encryptedData, 'base64')
);
console.log({encryptedData});
console.log("decrypted Data: ", decrytedData.toString('utf8'));