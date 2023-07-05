
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel")


exports.meInfo = async (req, res) => {

    if (!req.user) return res.status(400).json({ message: 'Me Failed' })

    res.status(200).json({ message: 'Me Successed', user: req.user })

}

exports.Login = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid Fields' })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: 'User not Created' })
    }

    const Matchpassword = await bcrypt.compare(password, user.password)
    if (!Matchpassword) {
        return res.status(400).json({ message: 'Password not Correct' })
    }

    const token = await jwt.sign({ id: user._id }, process.env.Jwt_Secret, { expiresIn: '7d' })

    res.status(201).json({ message: 'User Logined Successed', token, user })


}

// => register user => /api/user/register
exports.Register = async (req, res) => {

    const { name, email, password, avatar } = req.body
    console.log({ name, email, password, avatar })

    if (!email || !avatar || !name || !password) {
        return res.status(400).json({ message: 'Invalid Fields' })
    }


    const user = await userModel.findOne({ email })

    if (user) {
        return res.status(400).json({ message: 'User Already Created' })
    }

    const hashPassoword = await bcrypt.hash(password, 10)

    const newuser = await userModel.create({ name, email, password: hashPassoword, avatar })

    res.status(201).json({ success: true, message: 'User Registered', newuser })

}


// => all users => /api/user?search=atick
exports.allUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ]
    } : {}

    const users = await userModel.find(keyword).find({ _id: { $ne: req.user._id } })

    res.status(200).json({ users })

}
