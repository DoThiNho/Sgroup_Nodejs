const express = require('express')
const db = require('../database/connection')
const { getOne, create } = require('../database/query')
const {hashPassword, hashPasswordWithSalt} = require('../helpers/hash')
const {validateUser, validateRequest} = require('../middleware/validateUser')
const jsonwebtoken=require('jsonwebtoken')
const router = express.Router()

router.post('/register', validateUser, async (req, res) => {
    const {
        username,
        password,
        confirmpassword,
        name,
        age,
        gender,
        email
    } = req.body

    //check if user with username already existed
    const isUserExisted = await getOne({
        db,
        query: "SELECT * FROM users WHERE username = ?",
        params: username
    })
    if(isUserExisted) {
        return res.status(400).json( {
            message: 'Username already exists'
        })
    }

    const {
        salt,
        hashedPassword,
    } = hashPassword(password)
    const isUserCreated = await create({
        db,
        query: "INSERT INTO users (username, password, salt, name, email, age, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
        params: [
            username,
            hashedPassword,
            salt,
            name,
            email,
            age,
            gender
        ]
    })
    
    if(isUserCreated) {
        return res.status(200).json({
            message: 'Register successfully'
        })
    }
    return res.status(500).json({
        message: 'Internal server error'
    })
})

router.post('/login', validateRequest, async function (req, res, next) {
    const SECRET = process.env.SECRET
    // Get username, password from request body
    const {username, password} = req.body

    // Check if user exists
    const user = await getOne({
        db,
        query: "SELECT * FROM users WHERE username = ?",
        params: username
    })
    // If no: response
    if(!user){
        return res.status(400).json('User not found')
    }

    // If yes:
        // Compare password, here we hash the password from (request body + salt),
        // then compare with the hashedPassword store in db
        // If password is match:
            // Sign a jwt
            // Response
        const rawPassword = hashPasswordWithSalt(password, user.salt)
        if(rawPassword == user.password){
            const jwt = jsonwebtoken.sign({
                id: user.id,
                username: user.username,
                name: user.name, 
                age: user.age, 
                gender: user.gender,
                email: user.email
            }, SECRET, {
                algorithm: 'HS256',
                expiresIn: '1h'
            })
            return res.status(200).json({
                data: jwt,
                message: "LogIn successfull"
            })
        }
        // If password is not match:
        else {
            return res.status(400).json("Login failed!")
        }
})

module.exports = router



