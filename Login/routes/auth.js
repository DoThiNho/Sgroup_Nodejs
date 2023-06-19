const express = require('express')
const db = require('../database/knex-connection')
const {hashPassword, hashPasswordWithSalt} = require('../helpers/hash')
const {validateUser, validateRequest} = require('../middleware/validateUser')
const {mailService} = require('../services/mail.service')
const jsonwebtoken=require('jsonwebtoken')
const router = express.Router()

router.post('/register', [validateRequest, validateUser], async (req, res) => {
    const {
        hashedPassword,
        salt
    } = hashPassword(req.body.password)
    const user = {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        gender: req.body.gender,
        name: req.body.name,
        age: req.body.age,
        salt: salt,
        isAdmin: req.body.isAdmin,
        createdAt: new Date(Date.now())
    }
    // console.log(username, password);
    // check if user with username already existed
    const isUserExisted = await db.select().from('users').where('username', req.body.username).first()
    if(isUserExisted) {
        return res.status(400).json( {
            message: 'Username already exists'
        })
    }
    // console.log(hashedPassword);
    await db.insert(user).into('users')
    return res.status(200).json({
        message: 'Register successfully'
    })
})


router.post('/login', validateRequest, async function (req, res) {
    const SECRET = process.env.SECRET
    // Get username, password from request body
    const {
        username,
        password, 
    } = req.body
    // Check if user exists
    const user = await db.select('*').from('users').where('username', username).first()
    if(!user) {
        return res.status(400).json( {
            message: 'User not found',
        })
    }
    else {
        const salt = user.salt
        const password_db = user.password
        const hashedPassword = hashPasswordWithSalt(password, salt)
        if(password_db == hashedPassword) {
            const jwt = jsonwebtoken.sign({
                id: user.id,
                username: user.username,
                password: user.password, 
                email: user.email,
                isAdmin: user.isAdmin
            }, SECRET, {
                algorithm: 'HS256',
                expiresIn: '1h',
            })
            return res.status(200).json({ 
                data: jwt,
                message: "Login successful"
            })
        }
        else {
            return res.status(400).json( {
                message: 'Invalid credentials',
            })
        }
    }
});

// SEND EMAIL
router.post('/reset', async(req, res) => {
    const {emailFrom, emailTo, emailSubject, emailText} = req.body
    let info = await mailService.sendEmail(emailFrom, emailTo, emailSubject, emailText)
    res.json({
        message: nodemailer.getTestMessageUrl(info)
    })
})

module.exports = router



