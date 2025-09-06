const express = require("express")
const route = express.Router()
const {authenticate,authorize_Admin} = require('../middleware/authenticate')
const {
    register_user,
    login,
    user_profile,
    get_all_users,
    log_out,
    delete_user,
    update_user
} = require("../controller/user_controller")

route.post("/register",register_user)
route.post('/login',login)
route.get('/profile',authenticate,user_profile)
route.get("/all-users",authenticate,authorize_Admin,get_all_users)
route.get('/log-out',authenticate,log_out)
route.delete('/delete',authenticate,delete_user)
route.delete('/admin-delete/:id',authenticate,authorize_Admin,delete_user)
route.post('/update-user',authenticate,update_user)

module.exports = route