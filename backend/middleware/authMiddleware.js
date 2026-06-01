const express=require('express')
const app=express()
const jwt=require('jsonwebtoken')
app.use(express.json())
function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization'];
    const token =authHeader && authHeader.split(' ')[1]
    if(token==null) return res.status(401).json({message:'No token'})
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.status(403).json({message:'Invalid Token'})
        req.user=user
        next()
    })
}
module.exports=authenticateToken;