   require('dotenv').config();
const express=require("express");
const mongoose=require("mongoose");
const connectToDB=require("./config/db.js");
const noteRoutes=require("./routes.js");


const app=express();
 app.use(express.json());
const port=process.env.PORT || 3000;

app.use('/notes',noteRoutes);
app.use('/',noteRoutes);
 connectToDB();
app.listen(port,()=>{
     console.log(`Server running at port ${port}`);
});