const Listing = require("../models/listing");

module.exports.index = async (req,res)=> {
    const allListings = await Listing.find() ;
    res.render("./listings/index.ejs" , {allListings});
}

module.exports.newform =  (req,res)=> {
    res.render("./listings/new.ejs") ;
}

module.exports.showListing = async (req,res)=> {
    let { id } = req.params ;
    const listing =  await Listing.findById(id)
    .populate({
        path :"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner") ;
    if(!listing){
        req.flash("error","Listing you requested for doesn't exists");
        res.redirect("/listings");
    }
    else{
        res.render("./listings/show.ejs" , { listing });
    }
        
}

module.exports.createListing = async (req,res,next)=> {
    const listing1 =  await new Listing({...req.body.listing});
    listing1.owner = req.user._id ;
    await listing1.save();
    req.flash("success","New Listing Added");
    res.redirect("/listings");
}

module.exports.editForm = async  (req,res)=> {
    let { id } = await req.params ;
    let listing = await Listing.findById(id) ;    
    if(!listing){
        req.flash("error","Listing you requested for doesn't exists");
        res.redirect("/listings");
    } else {
    
    res.render("./listings/edit.ejs", { listing });
    }
}

module.exports.updateListing = async (req,res)=> {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let { id } = req.params ;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}) ;
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=> {
    let { id } = req.params ;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings")
}