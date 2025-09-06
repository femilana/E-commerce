const express = require("express")
const {authenticate,authorize_Admin} = require("../middleware/authenticate")
const {create_product,get_all_products,update_product,delete_product} = require("../controller/product_controller")

const route = express.Router()

route.get("/all-products",authenticate,get_all_products)
route.post("/create-new-product",authenticate,authorize_Admin,create_product)
route.put('/update-product',authenticate,authorize_Admin,update_product)
route.delete('/delete-product',authenticate,authorize_Admin,delete_product)


module.exports = route