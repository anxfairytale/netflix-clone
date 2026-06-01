const express = require('express')
const multer=require('multer')
const path=require("path")
const router = express.Router()
const db = require('../models/index')
const Image = db.Image
const authenticateToken=require('../middleware/authMiddleware')
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname);
    }
});
const upload=multer({storage});
router.get('/image/pending' ,async(req,res)=>{
    try{
        const images= await Image.findAll({
            where:{status:"pending"}
        });
        res.status(200).json(images);
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
router.get('/image/approved',async(req,res)=>{
    try{
        const images=await Image.findAll({
            where:{
                status:'approved'
            }
        });
        res.status(200).json(images);
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
router.get('/image', async (req, res) => {
    try {
        const image = await Image.findAll();
        console.log(image);
        res.status(200).json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/image/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findOne({where:{id},raw:true});
        if (!image) {
            return res.status(404).json({ message: 'Image not found' })
        }
        console.log(image)
        res.status(200).json(image)
    } catch (err) {
        return res.status(500).json(err);
    }
})
router.get('/video/:id',async(req,res)=>{
    try{
        const {id}=req.params
        const image=await Image.findOne({where:{id}});
        if(!image){
            return res.status(404).json({message:'Media not found'})
        }
        console.log(image)
        res.status(200).json(image);
    }catch(err){
        return res.status(500).json(err);
    }
})
router.post('/image', authenticateToken, upload.fields([{name:'image',maxCount:1},{name:'video',maxCount:1}]), async (req, res) => {
  try {
    console.log("USER:", req.user)
    console.log("BODY:", req.body)
    console.log("FILES:", req.files)
    const imageFile=req.files.image?.[0]||null
    const videoFile=req.files.video?.[0]||null
    if(!imageFile && !videoFile){
        return res.status(400).json({
            message:'Please upload at least an image or a video'
        })
    }
    const image = await Image.create({
      title: req.body.title,
      description: req.body.description,
      imageURL: imageFile? imageFile.path:null,
      videoURL: videoFile?videoFile.path:null,
      status: 'pending',
      userId:req.user.id
    })

    res.status(201).json({
      message: 'Media uploaded successfully and waiting for approval',
      image
    })
  } catch (err) {
    console.log("UPLOAD ERROR:", err)
    return res.status(500).json({
      message: err.message
    })
  }
})

router.put('/image/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findOne({where:{id}});
        await Image.update(
            {
                title:req.body.title,
                description:req.body.description,
                imageURL:req.body.imageURL
            },
            {
                where:{id}
            }
        );
        res.status(201).json({ message: 'image updated succefully' })
    } catch (err) {
        return res.status(500).json(err);
    }
})

router.delete('/image/:id', async (req, res) => {
    try {
        const { id } = req.params
        const image = await Image.findOne({where:{id}});
        if (!image) {
            return res.status(404).json({ message: 'image not found' })
        }
        await image.destroy();
        res.status(200).json({ message: 'successfully deleted' });
    } catch (err) {
        return res.status(500).json(err);
    }
})


router.patch('/image/:id/approve',async(req,res)=>{
    try{
        await Image.update(
            {
                status:'approved'
            },
            {
                where:{id: req.params.id}
            }
        )
        res.status(200).json({
            message:'Image approved successfully'
        });
    }catch(err){
        res.status(500).json({error:err.message});
    }
});
router.patch('/image/:id/reject',async(req,res)=>{
    try{
        await Image.update(
            {
                status:'rejected'
            },
            {
                where:{id:req.params.id}
            }
        )
        res.status(200).json({
            message:'Image rejected successfully'
        })
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
module.exports = router