const Listing = require("../models/listing.js") ;
const review = require("../models/review.js") ;

module.exports.postReview = async(req,res)=>{
    let listening = await Listing.findById(req.params.id) ;
    let newreview = new review(req.body.review) ;
    newreview.author = req.user._id ;
    await listening.reviews.push(newreview) ;
    await newreview.save();
    await listening.save();
    req.flash("success","Review Created");
    res.redirect(`/listings/${listening.id}`);
}

module.exports.deleteReview = async(req,res)=> {
    let { id , reviewid } = req.params ;
    let reviewinlisting  = await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
    let dltreview = await review.findByIdAndDelete(reviewid);
    console.log(dltreview);
    
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}