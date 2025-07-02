const express = require("express")
const router = express.Router() ;
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isOwner,validateListing,isLoggedIn} = require("../middleware.js");

const listingController = require("../controllers/listings.js") ;


router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,wrapAsync (listingController.createListing) );


//newform route
router.get("/new" ,isLoggedIn,listingController.newform) ;


router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(validateListing,isOwner, wrapAsync(listingController.updateListing))
.delete(isOwner,wrapAsync(listingController.deleteListing))




//editform route 
router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(listingController.editForm));

module.exports = router ;