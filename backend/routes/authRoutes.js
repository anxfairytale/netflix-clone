const express=require('express')
const cors=require('cors')
const nodemailer=require("nodemailer")
const router=express.Router()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const db=require('../models/index')
const User=db.User
function generateAccessToken(user){
    return jwt.sign(
        {id:user.id,email:user.email, role:user.role, name:user.name},
        process.env.JWT_SECRET,
        {expiresIn:'15m'}
    )
}
router.post('/signup',async(req,res)=>{
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
})
router.post('/login',async(req,res)=>{
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
})
const otpStore={}
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});
router.post('/send-otp',async (req,res)=>{
    try{
        const {email}=req.body
        if(!email){
            return res.status(400).json({message:"EMail is required"})
        }
        const otp=Math.floor(
            100000 + Math.random()*900000
        ).toString();
        otpStore[email]=otp;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to:email,
            subject: 'Verify your account',
            text:  `Your OTP is ${otp}`
        });
        res.json({
            message:'Otp sent'
        })
    }catch(err){
        res.status(500).json(err);
    }
});
router.post('/verify-otp',async(req,res)=>{
    try{
        const {email,otp}=req.body;
        if(!email || !otp) {return res.status(400).json({
            message:"email is missing"
        })}
        if(otpStore[email]!==otp){
            return res.status(404).json({message:'Incorrect otp'});
        }
        return res.json({
            message:'Success'
        })
    }catch(err){
        console.log(err);
    }
})
module.exports=router
