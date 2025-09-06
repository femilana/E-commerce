const product = require('../model/product_model')

const create_product = async(req,res,next) =>{
    try{
        const {name,price,category,description,imageUrl,countInStock} = req.body

        if(!name || !price || !category || !description || !countInStock){
            return res.status(400).json({message:"Name, price, description, countInStock and category are required"})
        }

        const new_product = new product({name,price,category,description,imageUrl,countInStock})
        await new_product.save()
        return res.status(201).json({message:"New Product Successfully Created",
            Product:{
                name:new_product.name,
                price:new_product.price,
                category:new_product.category,
                description:new_product.description,
                countInStock:new_product.countInStock

        }
        })
    }

    catch(error){
        next(error)
    }
}

const get_all_products = async(req,res,next) =>{
    try{
        const user = req.user

        //checking if user is logged in
        if(!user){
            return res.status(401).json({message:"Kindly Login"})
        }
        const get_product = await product.find()
        return res.status(201).json({message:get_product})
    }
    catch(error){
        next(error)
    }
}

const get_product_by_name = async(req,res,next) =>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(401).json({message:"No Input provided"})
        }
        const get_by_name = await product.findOne({name})
        if(!get_by_name){
            return res.status(401).json({message:"Product not Available"})
        }
        return res.status(201).json({message:"search successful",get_by_name})
    }
    catch(error){
        next(error)
    }
}

const update_product = async(req,res,next) =>{
    try{
        const user = req.user
        const {name,price,category,description,imageUrl,countInStock} = req.body

        if(!name){
            return res.status(400).json({message:"NAME field is required"})
        }

        if(!user || !user.admin){
            return res.status(401).json({message:"You are not Authorized"})
        }

        const product_update = await product.findOne({name})

        if(!product_update){
            return res.status(404).json({message:"Product not Available"})
        }

        product_update.name = name || product_update.name
        product_update.price = price || product_update.price
        product_update.category = category || product_update.category
        product_update.description = description || product_update.description
        product_update.imageUrl = imageUrl || product_update.imageUrl
        product_update.countInStock = countInStock || product_update.countInStock

        const updated_product = await product_update.save()
        return res.json({ message: "Product updated successfully", updated_product})
    }

    catch(error){
        next(error)
    }
}

const delete_product = async(req,res,next) =>{
    try{
        const user = req.user
        const {id,name} = req.body

        //checking if the user pass in an input
        if(!id && !name){
            return res.status(400).json({message:"NAME or ID field is required"})
        }

        //checking if the Admin is logged in
        if(!user || !user.admin){
            return res.status(403).json({message:"You are not Authorized"})
        }

        //Another method to find and delte with multiple option
        //let product_delete;
        // if (id) {
        // product_delete = await product.findByIdAndDelete(id);
        // } else if (name) {
        // product_delete = await product.findOneAndDelete({ name });}

        //Search and delete product
        const product_delete =await product.findOneAndDelete({
            $or:
            [
                {name:name},
                {_id:id}
            ]
        })
        if(!product_delete){
            return res.status(404).json({message:"Product unavailable"})

        }
        return res.status(200).json({message:`${product_delete.name} successfully deleted`})

    }
    catch(error){
        next(error)
    }

}

module.exports = {create_product,get_all_products,update_product,delete_product}