const { default: mongoose } = require("mongoose");


const messageSchema = mongoose.Schema({
    sender : { type : mongoose.Schema.Types.ObjectId , ref : "users" } ,
    // ref target korbe sodo oi collection ar _id ke ar kaoke parbe na so
    // aiter means users ar modden ai id kew takle anbe
    content : { type : String , trim : true } ,
    chat : { type : mongoose.Schema.Types.ObjectId , ref : "chats" } ,
})

const messageModel = mongoose.model('messages' , messageSchema)
module.exports = messageModel