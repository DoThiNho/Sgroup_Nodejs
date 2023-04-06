const express = require('express')
const user_router = express.Router();

user_router.use(express.json())//json -> object

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

user_router.post('/add', (req, res) => {
	const user = {
        'id': users.length + 1,
        ...req.body
	}
	users.push(user)
	res.status(201).send(JSON.stringify({
		success: true,
		notice: 'Ban da them thanh cong',
		data: user
	}))
})

user_router.put('/edit/:id', (req, res) => {
	const user = users.find(user => user.id === parseInt(req.params.id))
    console.log(user);
	user.fullname = req.body.fullname
	user.gender = req.body.gender
	user.age = req.body.age
	res.send(JSON.stringify({
		success: true,
		notice: 'Ban da cap nhat thanh cong',
		data: user
	}))
})

user_router.delete('/delete/:id', (req, res) => {
	const user = users.find(user => user.id === parseInt(req.params.id))
	res.send(JSON.stringify({
		success: true,
		notice: 'Ban da xoa thanh cong',
	}))
})

module.exports = user_router