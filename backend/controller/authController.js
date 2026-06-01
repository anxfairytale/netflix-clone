const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const db=require('../models/index')
const User=db.User
function generateAccessToken(user){
    return jwt.sign(
        {id:user.id,email:user.email, role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'15m'}
    )
}
exports.signup=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        const existingUser= await User.findOne({where:{email}})
        if(existingUser){
            return res.status(400).json({message:'User already exists'})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const user=await User.create({
            name,email,password:hashedPassword
        })
        const accessToken=generateAccessToken(user)
        res.status(201).json({
            message:'User Created',
            accessToken
        })
    }catch(err){
        res.status(500).json({message:err.message});
    }
}
exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({where:{email}})
        if(!user){
            return res.status(400).json({message:'Invalid email or password'})
        }
        const passwordIsValid=await bcrypt.compare(password,user.password)
        if(!passwordIsValid){
            return res.status(400).json({message:'Invalid email or password'})
        }
        const accessToken=generateAccessToken(user)
        res.json({
            message:'Login successful',
            accessToken
        })
    }catch(err){
        res.status(500).json({message:err.message});
    }
}