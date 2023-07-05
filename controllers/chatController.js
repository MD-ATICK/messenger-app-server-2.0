const chatModel = require("../models/chatModel")
const userModel = require("../models/userModel")



// Model => chatName | isGroupChat | users(array) | latestMessage in sender | groupAdmin

exports.accessChat = async (req, res) => {

    const { oppositeUserId } = req.body

    if (!oppositeUserId) return res.status(400).json({ message: 'Message Pathner Not Found' })

    let olderChat = await chatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: oppositeUserId } } },
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage")
    // => after populate latestMessage => chat extracture is : {
    // ... all thing ,
    // latestMessage : {
    //    sender : mongoose object id ,
    //    content : '' ,
    //    chat : ""
    //   }
    // }

    //  => means => userModel all users teke tene asbe hoicce oneke server listin ar port ar moto value ance olderchat ance 
    // => then oiter latestMesaage.sender or id diye userModel ar user teke name avatar email anbe 
    // => result is olderchat + latestMesaage.sender ar name , avatar , email
    olderChat = await userModel.populate(olderChat, {  // => populate => nibe --> But mongoose id + ref : a collection name tka lagbe.
        path: 'latestMessage.sender',
        select: "name avatar email"
    })

    // userModel teke populate(tanbe) sender ta user jonno ai kahini je olderchat ar mardone value sob niye  


    if (olderChat.length > 0) {
        return res.status(201).json({ message: 'Finded Chat', olderChat })
    }

    const createdChat = await chatModel.create({
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, oppositeUserId]
    })

    const Fullchat = await chatModel.findOne({ _id: createdChat._id }).populate("users", "-password")

    res.status(201).json({ message: 'Created Chat', createdChat, Fullchat })
}

exports.myChats = async (req, res) => {
    try {
        let myChats = await chatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 }) // => ai mane hoice => kono chat updated hoiyer sathe sathe (-1) takle akdom sob gular top a and (1) takle sob gular bottom a.

        myChats = await userModel.populate(myChats, {
            path: "latestMessage.sender",
            select: "name avatar email"
        })

        res.status(200).json({ message: "Fetch My Chats Successed", myChats })

    } catch (error) {
        res.status(400).send({ message: "Fecth Chats Error" })
    }
}

exports.createGroupChat = async (req, res) => {

    const { grpname } = req.body
    let users = JSON.parse(req.body.users)


    if (!users || !grpname) {
        return res.status(400).json({ message: 'Invalid Fields' })
    }

    if (users.length < 2) {
        return res.status(400).json({ message: 'Group Member must at last 2' })
    }

    users.push(req.user)

    try {

        const newChat = await chatModel.create({
            chatName: grpname,
            users,
            isGroupChat: true,
            groupAdmin: req.user._id
        })


        const fullFillGroupChat = await chatModel.findOne({ _id: newChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(201).json({ message: "Group Created Successed", fullFillGroupChat })

    } catch (error) {
        res.status(400).send({ message: "Fecth Chats Error" })
    }
}

exports.renameGroupChat = async (req, res) => {
    const { chatId, chatName } = req.body

    const updateChat = await chatModel.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")

    if (!updateChat) return res.status(400).json({ message: 'Group Chat not found 404' })

    res.status(201).json({ message: "Updated Successed", updateChat })

}

exports.addUserGroupChat = async (req, res) => {

    const { chatId, userId } = req.body

    const addUser = await chatModel.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")

    if (!addUser) return res.status(400).json({ message: "Add User Failed" })

    res.status(201).json({ message: "Add Successed", addUser })

}

exports.removeUser = async (req, res) => {

    const { chatId, userId } = req.body

    const addUser = await chatModel.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")

    if (!addUser) return res.status(400).json({ message: "Add User Failed" })

    res.status(201).json({ message: "Add Successed", addUser })

}

exports.leaveGroupChat = async (req, res) => {

    const { chatId } = req.body

    const leavegroup = await chatModel.findByIdAndUpdate(chatId, { $pull: { users: req.user._id } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")

    if (!leavegroup) return res.status(400).json({ message: "Add User Failed" })

    res.status(201).json({ message: "Add Successed", leavegroup })

}