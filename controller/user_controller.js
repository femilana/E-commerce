const user = require("../model/user_model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const register_user = async(req,res,next) =>{
    try{
        const user_details = req.body
        const check_age = Number(user_details.age)

        //Checking if all required fields are entered by the user
        if(!user_details.email.trim() || 
        !user_details.password.trim() || 
        !user_details.age || 
        !user_details.name.trim() || 
        isNaN(check_age) || 
        check_age < 1){
            return res.status(400).json({error:"All fields are required"})
        }
        

        //Checking for existing User
        const existing_user = await user.findOne({email:req.body.email})
        if(existing_user){
            return res.status(400).json({message:"User already exist"})
        }

        //Hashing password before saving
        const salt = bcrypt.genSaltSync(10)
        const hashed_password = bcrypt.hashSync(user_details.password,salt)
        
        //Creating New User
        const create_user = new user({email:user_details.email.trim().toLowerCase(),
            password:hashed_password,
            age:check_age,
            name:user_details.name.trim(),
            hobbies:user_details.hobbies || []
        })
        await create_user.save()
        return res.status(201).json({
            message:"New user succesfully created",
            user:
            {
                id:create_user._id,
                name:create_user.name,
                age:create_user.age,
                hobbies:create_user.hobbies,
                email:create_user.email
            }
        })
    }
    catch(error){
        next(error)
    }

}

const login = async(req,res,next) =>{
    try{
        const {email,password} = req.body

        //checking if email and password is provided
        if(!email || !password){
            return res.status(400).json({erorr:"Kindly provide email and password"})
        }

        //checking if user exist
        const check_user = await user.findOne({email})
        if(!check_user){
            return res.status(400).json({message:"Invalid email or password"})
        }

        //Compare password with hashed password in DB
        const password_match = await bcrypt.compare(password,check_user.password)
        if(!password_match){
            return res.status(401).json({error:"Invalid email or password"})
        }
        
        //Creating the JWT token
        const token = jwt.sign(
            {id:check_user._id,email:check_user.email,admin:check_user.isAdmin},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )
        return res.cookie("web_token",token,{maxAge:1000*60*60,secure:true,httpOnly:true}).
        status(200).
        json({
            message:"Login Successful",
            user:{
                id:check_user._id,
                email:check_user.email,
                age:check_user.age,
                hobbies:check_user.hobbies
            }
        })
    }

    catch(error){
        next(error)
    }
}

const user_profile = async(req,res,next) =>{
    try{
        const client = req.user
        
        //Checking if user is already logged in
        if(!client || !client.id){
            return res.status(401).json({message:"Kindly Login"})
        }
        //Extracting user profile from database
        const user_profile = await user.findById(client.id).select("-password -isAdmin -__v")
        if(!user_profile){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(201).json({profile:user_profile})
    }
    catch(error){
        next(error)
    }
}

const get_all_users = async(req,res,next) =>{
    try{
        const all_users = await user.find({},{ password: 0, __v: 0 })
        return res.status(201).json({users:all_users})
    }
    catch(error){
        next(error)
    }
    
}

const update_user = async(req,res,next) =>{
    try{
        const client = req.user
        const {name,hobbies,age} = req.body

        //Checking if user is logged in
        if(!client || !client.id){
            return res.status(401).json({message:"Kindly Login"})
        }

        const update = await user.findById(client.id,)
        if(!update){
            return res.status(401).json({message:"Kindly Login"})
        }
        // Update fields (only if provided)
        update.name = name || update.name
        update.hobbies = hobbies || update.hobbies
        update.age = age || update.age

        const updated_user = await update.save()

        return res.status(200).json({
            Message:"user updated successfully",
            updated_user:updated_user})
    }
    catch(error){
        next(error)
    }
}

const log_out = async(req,res,next) =>{
    try{
        res.clearCookie('web_token',
            {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            }
        )
        return res.status(200).json({ success: true, message: 'Logged out successfully' })
    }
    catch(error){
        next(error)
    }
}

const delete_user = async(req,res,next) =>{
    try{
        const client = req.user
        
        //checking if user is logged in
        if(!client || !client.id){
            return res.status(401).json({message:"Kindly Login"})
        }

        let UserIdToDelete
        if(client.admin){
            UserIdToDelete = req.params.id
        }
        else{
            UserIdToDelete = client.id
        }
        const remove_user = await user.findByIdAndDelete(UserIdToDelete)
        
        //Checking if the User was successfully deleted
        if(!remove_user){
            return res.status(404).json({success: false,
                message: "User not Deleted"
            })
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            Deleted_user: {
                email:remove_user.email,
                name:remove_user.name
            }
        })

    }
    catch(error){
       next(error)
    }
}
module.exports = 
{
    register_user,
    login,
    user_profile,
    get_all_users,
    log_out,
    delete_user,
    update_user
}
