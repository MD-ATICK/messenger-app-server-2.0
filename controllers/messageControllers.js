const chatModel = require("../models/chatModel")
const messageModel = require("../models/messageModel")
const userModel = require("../models/userModel")



exports.messageSend = async (req, res) => {
    const { chatId, content } = req.body

    var newMessage = {
        sender: req.user._id,
        content,
        chat: chatId
    }

    try {

        var message = await messageModel.create(newMessage)

        message = await messageModel.findById(message._id)
            .populate('sender', "name email avatar")
            .populate('chat')

        message = await userModel.populate(message, {
            path: "chat.users",
            select: "name avatar email"
        })

        await chatModel.findByIdAndUpdate(chatId, {
            latestMessage: message._id
        })
        res.status(201).json({ message })


    } catch (error) {
        res.status(400).json({ message: 'failed to send message', error })
    }

}

exports.allMessages = async (req, res) => {
    const chatId = req.params.chatId

    try {
        const messages = await messageModel.find({ chat: chatId })
            .populate('sender', 'name email avatar')
            .populate("chat")

        res.status(200).json({ message: 'all messages get successed', messages })

    } catch (error) {
        res.status(400).send({ message: 'Error is always with me' })
    }


}