const Validate = require('../middlewars/validate')

const express = require('express')
const user_router = express.Router();
const connection = require('../../database/connection')


user_router.get('/',(req, res) => {
	const query = "SELECT * FROM User"
	connection.query(query, (error, result) => {
		if(error){
			return res.status(500).send("Error : Can't get data")
		} else {
			return res.status(200).json(result)
		}
	})
})

user_router.post('/', Validate, (req, res) => {
	const {fullname, gender, age} = req.body
	const query = "INSERT INTO User(fullname, gender, age) VALUES (?, ?, ?)"
	connection.query(query, [fullname, gender, age], (error, result) => {
        if (error) {
            return res.status(500).send("Error : Can't post data");
        }
        else {
            return res.status(201).send("Insert Done");
        }
    })
})

user_router.put('/:id', (req, res) => {
	const id = req.params.id
	const {fullname, gender, age} = req.body
	const query = "UPDATE User SET fullname = ? WHERE id = ?"
	connection.query(query, [fullname, id], (error, result) => {
		if (error) {
            return res.status(500).send("Error : Can't update data");
        }
        else {
            return res.status(204).send("Update done");
        }
	})
})

user_router.delete('/:id', (req, res) => {
	const id = req.params.id;
    const query = 'DELETE FROM User WHERE id = ?';
    connection.query(query, [id], (error, result) => {
        if (error) {
            return res.status(500).send("Error : Can't delete data");
        }
        else {
            res.status(204).send("Delete done");
        }
    });
})

module.exports = user_router
