const Listing = require("../models/listing");
const review = require("../models/review");

module.exports.index = async (req,res)=> {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs" , {allListings});
}

module.exports.newform =  (req,res)=> {
    res.render("./listings/new.ejs") ;
}

module.exports.showListing = async (req,res)=> {

    const { id } = req.params ;
    const listing =  await Listing.findById(id)
    .populate({
        path :"reviews",
        populate:{
            path:"author",
                populate:{
                    path:"_id"
                },
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
    let url = req.file.path ;
    let filename = req.file.filename ;
    const listing1 =  await new Listing({...req.body.listing});
    listing1.owner = req.user._id ;
    listing1.image = {filename, url}
    console.log(listing1);
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
    let imageurl = listing.image.url ;
    let blurimageurl =  await imageurl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs", { listing , blurimageurl});
    }
}

module.exports.updateListing = async (req,res)=> {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let { id } = req.params ;
    let newlisting  = await Listing.findByIdAndUpdate(id,{...req.body.listing}) ;

    if(typeof req.file !=="undefined") {
        let url = req.file.path ;
        let filename = req.file.filename ;
        newlisting.image = {url,filename} ;
        await newlisting.save() ;
    }

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