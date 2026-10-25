const express=require('express');
const {marked}=require('marked');
const router=express.Router();
const Note=require('./models/model');

//Create and save Note
router.post('/',async(req,res)=>{
      try{
         const {title, markdownText}=req.body;

         const htmlContent=marked(markdownText);

         const newNote=new Note({
             title,
             markdownText,
             htmlContent
         })

         await newNote.save();

         res.status(201).json({
             message:"Note saved successfully",
             note:newNote
         })
      }catch(error){
         console.error("error", error.message);
         res.status(500).json({error:error.message});
      }
})

// Get /notes

router.get('/',async (req,res)=>{
      
     try{
         const notes=await Note.find().sort({createdAt:-1});
          res.status(200).json(notes);
     }
});

//3 Get /notes/:id/html 
router.get('/:id/html',async (req,res)=>{

      try{
         const note=await Note.findById(req.params.id);
         if(!note){
             return res.status(404).json({message:"Note not found"});
         }
         res.setHeader('Content-Type','text/html');
         res.send(note.htmlContent);
      }catch(err){
         res.status(500).json({error:err.message});
      }
});

 router.post('/grammer-check', async(req,res)=>{
     try{
         const {text}=req.body;

          if(!text){
             return res.status(400).json({message:"Text is required for grammer checking"});
          }

          const response=await fetch('https://api.languagetool.org/v2/check',{
              method:'POST',
              headers:{
                  'Content-Type':'application/x-ww-from-urlencoded',

              },
              body:new URLSearchParams({
                  text:text,
                  language:'en-US'
              })

              
          });

            const result=await response.json();

            const matches=result.matches.map(match=>({
                message:match.message,
                offset:match.offset,
                length:match.length,
                replacements:match.replacements.map(r=>r.value).slice(0,3)
            }))
          
         res.status(200).json({
               success:true,
               totalErrors:matches.length,
               suggestions:matches
         })
     }catch(err){
         res.status(500).json({error:err.message});
     }
 })

module.exports=router;