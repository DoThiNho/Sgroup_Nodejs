const db = require('../database/knex-connection')
const express = require('express');
const jsonwebtoken = require('jsonwebtoken')
const router = express.Router();
const {validateUser } = require('../middleware/validateUser')
const { update } = require('../database/query')
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken')
const {hashPassword} = require('../helpers/hash')

router.post('/', [verifyToken, validateUser], async (req, res) => {
    if(req.user.isAdmin) {
        const isExistedUsername  = await db.select().from('users').where('username', req.body.username).first()
        if (!isExistedUsername) {
            const {
                hashedPassword,
                salt
            } = hashPassword(password)
            const { username, name, email, age, gender} = req.body;
            const createdBy = req.user.id
            const createdAt = new Date();
            
            db('users')
            .insert({ username, hashedPassword, salt, name, email, age, gender, createdBy, createdAt})
            .then(() => {
                res.status(201).send('Insert Done');
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send("Error: Can't post data");
            });
        }        
    }
});

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const {name, age, gender} = req.body
    await db('users')
        .where('id', req.params.id)
        .update({
            'name': name,
            'age': age,
            'gender': gender,
        })
    return res.status(200).json({ message: 'Update succesfully' })
})

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    await db('users')
        .where('id', req.params.id)
        .del()
    return res.status(200).json({ message: 'Delete succesfully' })
})

// pagination and search
route.get('/', async (req, res) => {
    const { page, size, title} = req.query;
    let pagination = {};
    if (page < 1) page = 1;
    var offset = (page - 1) * size;
    return Promise.all([
        db.count("* as count").from("users").first(),
        db.select("*").from("users").where("name", "like", `%${title}%`).offset(offset).limit(size),
        ])
        .then(([total, rows]) => {
            var count = total.count;
            var rows = rows;
            pagination.total = count;
            pagination.per_page = size;
            pagination.offset = offset;
            pagination.to = offset + rows.length;
            pagination.last_page = Math.ceil(count / size);
            pagination.current_page = page;
            pagination.from = offset;
            pagination.data = rows;
            res.status(200).json({ message: pagination })
    });
})

  

module.exports = router;