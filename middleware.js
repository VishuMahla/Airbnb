const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js") ;
const {reviewSchema} =require("./schema.js") ;
const review = require("./models/review.js");



module.exports.isLoggedIn = (req,res,next)=> {
    if(!req.isAuthenticated()){
        if(req.method === "GET"){
            req.session.redirectUrl = req.originalUrl ;  
        }
        req.flash("error","You need to login first");
        return res.redirect("/login");
    }
    next() ;
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next() ;
} ; 

//checks owner
module.exports.isOwner = async(req,res,next) => {
    let { id } = req.params ;
    let listing = await Listing.findById(id);
    if(!(listing.owner.equals(res.locals.curUser._id))){
        req.flash("error","You don't have access")
        return res.redirect(`/listings/${id}`);
    }
    next() ;
};

//validate listing
module.exports.validateListing = (req,res,next) => {
    let { error } = listingSchema.validate(req.body) ;
    if (error) {
        let errmsg = error.details.map((el)=> el.message).join(",") ;
        throw new ExpressError(400,errmsg);
    } else {
        next() ;
    }
};

//validate review
module.exports.validateReview = (req,res,next) => {
    let { error } = reviewSchema.validate(req.body) ;
    if (error) {
        let errmsg = error.details.map((el)=> el.message).join(",") ;
        throw new ExpressError(400,errmsg);
    } else {
        next() ;
    }
};

//review author 
module.exports.isReviewAuthor = async (req,res,next) => {
    let { id,reviewid } = req.params ;
    let currreview = await review.findById(reviewid);
    if(!(currreview.author.equals(res.locals.curUser._id))){
        req.flash("error","You don't have access")
        return res.redirect(`/listings/${id}`);
    }
    next() ;
}