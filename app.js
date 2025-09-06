const express = require('express')
const app = express()
const cookieParser = require("cookie-parser");
const notFound = require("./middleware/not_found")
const errorHandler = require("./middleware/error_handler")

app.use(express.json())
app.use(cookieParser());

const user_route = require("./routes/user_route")
const product_route = require("./routes/product_route")
const cart_route = require("./routes/cart.route")
const order_route = require("./routes/order_route")



//Test Route
app.get('/',(req,res)=>{
    res.send("'🚀  App is running")
})

app.use('/user',user_route)
app.use('/product',product_route)
app.use('/cart',cart_route)
app.use('/order',order_route)

// if no route matches → this runs
app.use(notFound);


// error handler at the END
app.use(errorHandler)



module.exports = app
