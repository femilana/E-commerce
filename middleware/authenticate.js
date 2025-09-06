const jwt = require('jsonwebtoken')

const authenticate = async(req,res,next) =>{
    try{
        const {web_token} = req.cookies

        if(!web_token){
            return res.json({message:"KIndly Login"})
        }
        const verify_token = jwt.verify(web_token,process.env.JWT_SECRET)

        req.user = {
            id:verify_token.id,
            admin:verify_token.admin
        }
        next()
    }
    catch(error){
        return res.json({error:error.message})
    }
}

const authorize_Admin = async(req,res,next) =>{
    try{
        if(!req.user || !req.user.admin){
        return res.status(403).json({ message: "Access denied. Admins only." })
    }
    next()
    }

    catch(error){
        return res.json({error:error.message})
    }
    
}

module.exports = {
    authenticate,
    authorize_Admin
}