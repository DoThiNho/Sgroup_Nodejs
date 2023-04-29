// encryption

const crypto = require("crypto")
const key = crypto.generateKeyPairSync(
    'rsa',
    { modulusLength: 2048 }
)

const rawPassword = "nho12345"
const publicKey = key.publicKey
const privateKey = key.privateKey

// Encrypt data with PUBLIC KEY
const encryptData = crypto.publicEncrypt(
    {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    },
    // We convert the data string to a buffer using Buffer.from
    Buffer.from(rawPassword)
).toString('base64')

// Decrypt data with PRIVATE KEY
const decryptData = crypto.privateDecrypt(
    {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    },
    Buffer.from(encryptData, 'base64')
)

