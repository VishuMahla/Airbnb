const express = require("express")
const router = express.Router() ;
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js") ;
const Listing = require("../models/listing.js");
//validate listing
const validateListing = (req,res,next) => {
    let { error } = listingSchema.validate(req.body) ;
    if (error) {
        let errmsg = error.details.map((el)=> el.message).join(",") ;
        throw new ExpressError(400,errmsg);
    } else {
        next() ;
    }
};


//index Route 
router.get("/", wrapAsync( async (req,res)=> {
    const allListings = await Listing.find() ;
    res.render("./listings/index.ejs" , {allListings});
}));

//new route
router.get("/new" , (req,res)=> {
    res.render("./listings/new.ejs") ;
})

//Show route
router.get("/:id" , wrapAsync(async (req,res)=> {
    let { id } = req.params ;
    const listing =  await Listing.findById(id).populate("reviews") ;
    res.render("./listings/show.ejs" , { listing });
}));

//create route
router.post("/" ,validateListing ,wrapAsync (async (req,res,next)=> {
    const listing1 =  await new Listing({...req.body.listing});
    await listing1.save()
    res.redirect("/listings");
}) )

//edit route 
router.get("/:id/edit" ,wrapAsync(async  (req,res)=> {
    let { id } = await req.params ;
    let listing = await Listing.findById(id) ;    
    res.render("./listings/edit.ejs", { listing });
}));

//update route
router.put("/:id" , wrapAsync(async (req,res)=> {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let { id } = req.params ;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}) ;
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id" ,wrapAsync(async (req,res)=> {
    let { id } = req.params ;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings")
}))

module.exports = router ;