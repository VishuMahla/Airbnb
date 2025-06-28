const express = require("express");
const router = express.Router({mergeParams:true}) ;
const {reviewSchema} = require("../schema.js") ;
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
//validate review
const validateReview = (req,res,next) => {
    let { error } = reviewSchema.validate(req.body) ;
    if (error) {
        let errmsg = error.details.map((el)=> el.message).join(",") ;
        throw new ExpressError(400,errmsg);
    } else {
        next() ;
    }
};


//review 
//post review
router.post("/" , validateReview , wrapAsync( async(req,res)=>{
    let listening = await Listing.findById(req.params.id) ;
    let newreview = new Review(req.body.review) ;
    await listening.reviews.push(newreview) ;
    await newreview.save();
    await listening.save();
    console.log("review saved successfully");
    res.redirect(`/listings/${listening.id}`);
})) ;

//review
//delete review
router.delete("/:reviewid" ,wrapAsync(async(req,res)=> {
    let { id , reviewid } = req.params ;
    let reviewinlisting  = await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
    let review = await Review.findByIdAndDelete(reviewid);
    console.log(review);
    console.log(reviewinlisting);
  
    res.redirect(`/listings/${id}`);
    
}))

module.exports = router ;