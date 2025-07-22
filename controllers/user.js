const User = require("../models/user.js") ;


module.exports.signUpForm = (req,res)=> {
    res.render("../views/user/signup.ejs");
}

module.exports.signUp = async (req,res)=> {
    try {
        let {username ,email , password } = req.body ;
    const newUser =   new User({email , username }) ;
    const registeredUser = await  User.register(newUser,password);
    console.log(registeredUser);
    req.logIn(registeredUser,(err)=> {
        if(err) {
            return next(err);
        }
        req.flash("success","Welcome to Nestera");
        res.redirect("/listings");
    })
    
    } catch (error) {
        req.flash("error",error.message) ;
        res.redirect("/signup");
    }
}

module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome back to Nestera !");
    if(!res.locals.redirectUrl){
    return res.redirect("/listings");
    }
    res.redirect(res.locals.redirectUrl);
}

module.exports.logInForm = (req,res)=> {
    res.render("../views/user/login.ejs");
}


module.exports.logOut = (req,res)=> {
    req.logOut((err)=> {
        if(err){
           return next(err);
        }});

        req.flash("success","LogOut Successfull") ;
        res.redirect("/listings");
    }