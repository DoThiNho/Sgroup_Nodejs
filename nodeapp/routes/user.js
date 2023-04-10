const Validate = require('../middlewars/validate')

const express = require('express')
const user_router = express.Router();

// user_router.use(express.json())//json -> object

let  users = [
    {
		"id": 1,
		"fullname": "Nguyen Huy Tuong",
		"gender": true,
		"age": 18
	},
	{
		"id": 2,
		"fullname": "Nguyen Thi Tuong",
		"gender": false,
		"age": 15
	}
]

user_router.get('/',(req, res) => {
    res.status(200).send(users)
})

user_router.post('/', Validate, (req, res) => {
	const user = {
        'id': users.length + 1,
        ...req.body
	}
	users.push(user)
	res.status(201).json('Ban da them thanh cong')
})

user_router.put('/:id', (req, res) => {
	const user = users.find(user => user.id === parseInt(req.params.id))
	if(req.body != null){
		user.fullname = req.body.fullname
		user.gender = req.body.gender
		user.age = req.body.age
		res.status(200).json('Ban da cap nhat thanh cong')
	} else {
		res.status(204).json('Ban da cap nhat that bai')
	}
})

user_router.delete('/:id', (req, res) => {
	users = users.filter(item => item.id !== parseInt(req.params.id))
	res.status(204).json('Ban da xoa thanh cong')
})

module.exports = user_router
