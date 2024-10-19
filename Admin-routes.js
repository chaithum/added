
const express = require('express')

const {signUp,logIn,forgot_password} =require('../controller/Admin-Controller')

const AdminRouter=express.Router();

AdminRouter.post("/adminsignup", signUp)
AdminRouter.post("/adminlogin", logIn)
AdminRouter.put("/adminforgetpassword",forgot_password)

module.exports = AdminRouter