const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const flash = require("connect-flash");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.listen(8080,()=> {
    console.log("app is listening to the port 8080");
})

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  console.log("connecting to db");
  
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs',ejsMate);

app.use(express.static(path.join(__dirname,"/public")))
 
app.get("/", (req,res)=> {
    res.send("Hi im root");
})


const sessionOptions = {
  secret:"myme" ,
  resave : false ,
  saveUninitialized : true ,
  cookie : {
    expires : Date.now() + 7 * 24 *  60 * 60 *1000,
    maxAge : 7 * 24 *  60 * 60 *1000 ,
    httpOnly : true ,
  }
} ;

app.use(session(sessionOptions)) ;
app.use(flash());


app.use((req,res,next)=> {
  res.locals.success = req.flash("success"); 
  res.locals.failure = req.flash("failure");
  next();
})

app.use("/listings", listings) ;
app.use("/listings/:id/reviews" , reviews) ;

app.all(/./, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found"));
});


app.use((err,req,res,next)=> {
    let { statusCode = 500, message="something went wrong" } = err ;
    console.log(message);
    res.status(statusCode).render("./error/error.ejs" ,{ message });
})
