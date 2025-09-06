const mongoose = require("mongoose")

const product_schema = new mongoose.Schema({
    name:
    {
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    description:
    {
        type:String,
        required:true
    },
    price:
    {
        type:Number,
        required:true,
        min:0
    },
    category:
    {
        type:String,
        required:true
    },
    imageUrl:
    {
        type:String,
        required:false
    },
    countInStock:
    {
        type:Number,
        required:true,
        default:0
    }
},{timestamps:true})

const product = mongoose.model('product',product_schema)

module.exports = product