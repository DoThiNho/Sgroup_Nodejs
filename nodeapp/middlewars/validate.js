function Validate(req, res, next) {
    const user = {
        ...req.body
	}
    if(user.age <= 0){
        res.status(400).send('Ban phai nhap tuoi > 0')
    } else {
        next()
    }
}

module.exports = Validate