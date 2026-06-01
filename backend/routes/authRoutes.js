const express=require('express')
const cors=require('cors')
const nodemailer=require("nodemailer")
const router=express.Router()
const authController=require('../controller/authController')
router.post('/signup',authController.signup)
router.post('/login',authController.login)
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
