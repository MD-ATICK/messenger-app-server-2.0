const express = require('express')
const { isAuthUser } = require('../auth/auth')
const { accessChat, myChats, createGroupChat, leaveGroupChat, removeUser, renameGroupChat, addUserGroupChat } = require('../controllers/chatController')
const router = express.Router()

// => user chat existable
router.get('/', isAuthUser, myChats)
router.post('/', isAuthUser, accessChat)

// => gorup existable
router.post('/group', isAuthUser, createGroupChat)
router.put('/rename', isAuthUser, renameGroupChat)
router.put('/groupadduser', isAuthUser, addUserGroupChat)
router.put('/removeuser', isAuthUser, removeUser)
router.put('/leaveGroup', isAuthUser, leaveGroupChat)


module.exports = router