require('dotenv').config();
const express=require('express');
const router=express.Router();
const imageRoutes=require('./imageRoutes')
const authRoutes=require('./authRoutes')
router.use('/api',imageRoutes)
router.use('/auth',authRoutes)
router.get('/',(req,res)=>{
    res.send('Backend initialised')
})
module.exports = router;