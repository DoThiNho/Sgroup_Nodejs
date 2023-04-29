const express = require('express');
const jsonwebtoken = require('jsonwebtoken')
const router = express.Router();
const {validateUserUpdate } = require('../middleware/validateUser')
const { update } = require('../database/query')


const db = require('../database/connection');

// UPDATE USER INFO
router.put('/:id', validateUserUpdate, async function (req, res, next) {
    const SECRET = process.env.SECRET
    const id = req.params.id
    const {name, age, gender} = req.body
    const authorizationHeader = req.headers.authorization
    const userToken = authorizationHeader.substring(7)
    try {
        const isTokenValid = jsonwebtoken.verify(userToken, SECRET);
        if (isTokenValid.id == id) {
            const isUpdateUser = await update({
                db,
                query: "UPDATE users SET name = ?, age = ?, gender = ? WHERE id = ?",
                params: [
                    name,
                    age,
                    gender,
                    id
                ]
            })

            if(!isUpdateUser){
               return res.status(500).json("Error : Can't update data")
            }
            return res.status(200).json({
                message: "Update successfull"
            })
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

});

module.exports = router;