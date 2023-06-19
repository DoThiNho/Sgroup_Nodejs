const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']
    if(!token) return res.status(401).json('Unauthorize user')

   try{
        const decoded = jwt.verify( token , process.env.SECRET );
        console.log(decoded)
        req.user = decoded
        next()

   }catch(e){
    console.log(e)
    res.status(400).json('Token not valid')
   }
}

const verifyTokenAndAuthorization = async (req, res, next)=>{
    await verifyToken(req, res, () =>{
        if(req.user.id === parseInt( req.params.id)|| req.user.isAdmin){
            next()
        }
        else{
            return res.status(403).json('You are not allowed!')
        }
    }) 
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization
}