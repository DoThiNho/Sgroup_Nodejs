const express = require('express')
const jsonwebtoken = require('jsonwebtoken')
const user_router = express.Router()
const crypto = require('crypto')

// const app = express()

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulesLength: 2048
})

const dbs = [
    {
        username: 'thinh',
        age: 22,
        email: 'thinh@gmail.com',
        id: 1,
        password: 'thinh12345',
        balance: 1000000,
    },
    {
        username: 'phu',
        age: 24,
        email: 'phu@gmail.com',
        id: 2,
        password: 'phu12345',
        balance: 1000000000,
    },
];

// const SECRET = 'your-secret'

// app.use(express.json())

user_router.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const user = dbs.find(u => u.username == username)

    if(!user){
        return res.status(400).json({
            message: 'User not found'
        })
    } 

    if(user.password == password){
        const jwt = jsonwebtoken.sign({
            username: user.username,
            email: user.email,
            age: user.age
        }, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
        })

        return res.status(200).json({
            data: jwt,
            message: 'Login sucess',
        })
    }
    
    return res.status(401).json({
        message: 'Invalid credentials',
    });

})

user_router.get('/balance', (req, res, next) => {
    const username = req.body.username
    const authorizationHeader = req.headers.authorization
    const userToken = authorizationHeader.substring(7)

    try {
        const isTokenValid = jsonwebtoken.verify(userToken, SECRET);
        
        // Authorization success
        if (isTokenValid.username == username) {
            const user = dbs.find(u => u.username === username);

            return res.status(200).json({
                balance: user.balance,
            });
        }

        // Authorization failed
        return res.status(401).json({
            message: 'unauthorized',
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message,
        });
    }
})

module.exports = user_router

