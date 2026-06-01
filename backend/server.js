require('dotenv').config();
const express=require('express');
const cors=require('cors')
const app=express();
const db = require('./models/index');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const routes=require('./routes/index')
app.use(cors()); 
app.use(express.json());
app.use('/uploads',express.static('uploads'));
app.use('/',routes)
db.sequelize.sync()
.then(()=>{
    console.log('Database Connection succeful');

    app.listen(process.env.PORT,()=>{
        console.log(`Server is listening to port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(err);
})