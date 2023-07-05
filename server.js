require('dotenv').config()

const cors = require('cors')
const express = require('express');

const { connectDB } = require('./config/mongodb');

const userRouter = require('./routes/userRoute');
const chatRouter = require('./routes/chatRoute')
const messsageRouter = require('./routes/messageRoute')

const app = express();
const port = process.env.Port || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res) => res.status(200).json({ message: 'Server OK!' }))

app.use('/api/user', userRouter)

app.use('/api/chat', chatRouter)

app.use('/api/message', messsageRouter)

app.use('*', (req, res) => res.status(200).json({ message: 'Request not Accepted' }))


const server = app.listen(port, () => {
    console.log(`server in listening on https://localhost:${port}`);
    connectDB()
})


// socket.io used <<==
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173'  // => client port
    }
})

// ==>> create a connection
io.on("connection", (socket) => {
    // console.log(`connection to Socket.io ${socket.id} `)

    // => create specific room 
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        // console.log('sokect connect with me client : ', userData._id)
        socket.emit('connected') // => room connect message show just
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log(`Socket joined Room : ${room}`)
    })

    socket.on('new message', (newMessageRecived) => {
        console.log('chat', newMessageRecived)
        const chat = newMessageRecived.chat;
        if (!chat.users) return console.log('chat.users not defined')

        chat.users.forEach((user) => {
            if (user._id == newMessageRecived.sender._id) return;

            socket.in(user._id).emit('message recived', newMessageRecived)
        })
    })
})