function checkMinLength(str, minlength){
    if(str.length < minlength) return false
    return true 
}

function checkEmail(email){
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(email.match(regex)){
        return true
    }
    return false
}

function checkAge(age){
    if(Number.isInteger(age) && age > 0) return true
    else return false
}

function validateUser(req, res, next) {
    const {username, password, name, age, gender, email, createdBy, createdAt} = req.body 
    if(!checkMinLength(username, 3)){
        res.status(400).json('Length username < 3')
    }
    if(!checkMinLength(password, 3)){
        res.status(400).json('Length password < 3')
    }
    // if(confirmpassword !== password){
    //     res.status(400).json("Password not match")
    // }
    if(!checkEmail(email)){
        res.status(400).json("Invalid email")
    }
    if(typeof gender !== "boolean") {
        res.status(400).json("Invalid gender")
    }
    if(!checkMinLength(name, 2)){   
        res.status(400).json('Length name < 3')
    }
    if(!checkAge(age)){
        res.status(400).json("Invalid age")
    }
    next()
}

function validateUserUpdate(req, res, next){
    const {name, age, gender} = req.body 
    if(!checkMinLength(name, 2)){
        res.status(400).json('Length name < 3')
    }
    if(!checkAge(age)){
        res.status(400).json("Invalid age")
    }
    if(typeof gender != "boolean") {
        res.status(400).json("Invalid gender")
    }
    next()
}


function validateRequest(req, res, next) {
    if (req.body.username && req.body.password) {
        return next();
    }

    return res.status(400).json({ message: 'Error validating' });
}

module.exports = {
    validateUser,
    validateRequest,
    validateUserUpdate
}