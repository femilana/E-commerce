const mongoose = require("mongoose")
const product = require("./product_model")

const cart_schema = mongoose.Schema({
    user:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    products:
    [
        {
            product:
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"product",
                required:true
            },
            quantity:
            {
                type:Number,
                required:true,
                default:1
            }
        }
    ]
,},{ timestamps: true })

const cart = mongoose.model('cart', cart_schema)

module.exports = cart