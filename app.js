if(process.env.NODE_ENV != "production"){
  require('dotenv').config() ;
}

const mongoose = require("mongoose");
const dburl = process.env.ATLAS_DB_URL ;

async function connectDB() {
  try {
    await mongoose.connect(dburl);
    console.log("✅ Connected to MongoDB Atlas");
    console.log("🧭 Host:", mongoose.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

connectDB();

// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }

const express = require("express");
const app = express();

const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const ListingsRouter = require("./routes/listing.js");
const ReviewsRouter = require("./routes/review.js");
const UserRouter = require("./routes/User.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



console.log("DB URL:", dburl);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.listen(8080,()=> {
    console.log("app is listening to the port 8080");
})




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs',ejsMate);

app.use(express.static(path.join(__dirname,"/public")))
 
app.get("/", (req,res)=> {
    res.redirect("/listings");
})

mongoose.connection.once('open', () => {
  console.log("🧭 Connected to:", mongoose.connection.host);
});

const store = MongoStore.create({
  mongoUrl:dburl,
  crypto :{
    secret:"cat"
  },
  touchAfter:24*3600,
}) ;

store.on("error",()=> {
  console.log("error in mongo session store");
}
);

const sessionOptions = {
  store,
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
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=> {
  res.locals.success = req.flash("success"); 
  res.locals.error = req.flash("error");
  res.locals.curUser = req.user ;
  next();
})


app.use("/listings", ListingsRouter) ;
app.use("/listings/:id/reviews" , ReviewsRouter) ;
app.use("/", UserRouter) ;


app.all(/./, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=> {
    let { statusCode = 500, message="something went wrong" } = err ;
    res.status(statusCode).render("./error/error.ejs" ,{ message });
})
