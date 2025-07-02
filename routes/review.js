const express = require("express");
const router = express.Router({mergeParams:true}) ;
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js")

const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");

//review 
//post review
router.post("/" ,isLoggedIn, validateReview , wrapAsync(reviewController.postReview)) ;

//review
//delete review
router.delete("/:reviewid" ,isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports = router ;