const { default: mongoose, Schema } = require("mongoose");


const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    avatar: {
        type: String,
        default: 'https://i.pinimg.com/736x/55/9a/7c/559a7c4557f80baa87d66fbbb51373eb.jpg'
    }
} ,
{ timestamps : true})

const userModel = mongoose.model('users' , userSchema)
module.exports = userModel