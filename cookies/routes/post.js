const express = require("express");
const app = express() ;


app.use("/post" , (req,res)=> {
    console.log("this is base rout for posts");
}) ;

app.use("/post/:id" , (req,res)=> {
    console.log("this is post id route");
})

