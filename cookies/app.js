const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const session = require("express-session");

const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// const router = express.Router ;
// const posts = require("./routes/post.js");
const flash = require("connect-flash");

const sessionOption = {
    secret:"abcd1234",
    resave: false,
    saveUninitialized:true
} ;

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=> {
    res.locals.successmsg = req.flash("success");
    res.locals.errormsg = req.flash("error");
    next();
})

app.get("/register" ,(req,res)=> {
    let {name= "anonymous"} = req.query ;
    req.session.name = name ;
    if(name === "anonymous"){
        req.flash("error","user not registered")
    }
    else{
        req.flash("success","user successfully registered")
    }
    res.redirect("/hello")
    })

app.get("/hello",(req,res)=> {
    console.log(req.session);
    res.render("page.ejs",{name : req.session.name});
})


app.get("/test",(req,res)=> {
    if(req.session.count){
        req.session.count ++ ;
    }
    else{
        req.session.count = 1 ;
    }
    res.send(`You visited the website ${req.session.count} times`);
    console.log(req.session);
    
})

app.listen(3000,(req,res)=> {
    console.log("app is working on port 3000");
})

// app.use(cookieParser()) ;

// app.get("/getcookies", (req,res)=> {
//     res.cookie("name","saloni");
//     res.cookie("class","11th");
//     res.send("cookies sent");
// })


// app.get("/" , (req,res) => {
//     let result = req.cookies;
//     console.dir(result);
//     res.send("im root path")
// }) ;
