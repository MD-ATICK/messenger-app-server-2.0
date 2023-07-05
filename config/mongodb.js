require('dotenv').config()
const mongoose = require('mongoose')

exports.connectDB = async () => {
    try {

       const { connection } =  await mongoose.connect(process.env.MONGO_URL, { dbName: 'chat-app' })
        console.log(`database connected on ${connection.host}`)

    } catch (error) {
        console.log(`no connected. ${error}`)
        process.exit()
    }
}