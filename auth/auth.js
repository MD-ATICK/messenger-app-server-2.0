const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

exports.isAuthUser = async (req , res , next) => {
    
    if(!req.headers.authorization) return res.status(400).send({message : 'User are not Logged'})
    
    const token = req.headers.authorization.split(" ")[1]
    
    jwt.verify(token , process.env.Jwt_Secret , async (err , result) => {
        if(err){
            return res.status(202).send({ message : 'Jwt token Expried' , error : err })
        }
        const user = await userModel.findById(result.id)
        req.user = user
        next()
    })
}