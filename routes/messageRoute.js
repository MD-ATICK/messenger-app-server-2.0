const express = require('express')
const { isAuthUser } = require('../auth/auth')
const { messageSend, allMessages } = require('../controllers/messageControllers')
const router = express.Router()

router.post('/' , isAuthUser , messageSend)

router.get('/:chatId' , isAuthUser , allMessages)

module.exports = router