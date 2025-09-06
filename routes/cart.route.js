const express = require("express")
const {
    addToCart,
    removeFromCart,
    getCart,
    updateQuantity,
    clearCart} = require("../controller/cart.controller")
const route = express.Router()
const {authenticate,authorize_Admin} = require('../middleware/authenticate')

route.post("/add-cart",authenticate,addToCart)
route.delete("/remove-product",authenticate,removeFromCart)
route.get("/user-cart/:userId",authenticate,getCart)
route.put("/update-cart",authenticate,updateQuantity)
route.delete("/clear-cart",authenticate,clearCart)



module.exports = route
