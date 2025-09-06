const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require("../controller/order_controller")

const {authenticate,authorize_Admin} = require("../middleware/authenticate")

const express = require("express")

const route = express.Router()

route.post("/create-order",authenticate,createOrder)
route.get("/create-order",authenticate,getUserOrders)
route.get("/create-order/:id",authenticate,authorize_Admin,getOrderById)
route.put("/create-order/:id",authenticate,authorize_Admin,updateOrderStatus)
route.delete("/create-order/",authenticate,authorize_Admin,deleteOrder)



module.exports = route