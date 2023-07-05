const express = require('express')
const { Login, Register, allUsers , meInfo } = require('../controllers/userController')
const { isAuthUser } = require('../auth/auth')
const router = express.Router()

router.get('/allusers' , isAuthUser , allUsers)

router.get('/me' , isAuthUser , meInfo)

router.post('/login' , Login)

router.post('/register' , Register)



module.exports = router