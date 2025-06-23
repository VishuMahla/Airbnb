const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js") ;

const Listing = require("./models/listing.js");
app.use(express.urlencoded({extended:true}));

app.listen(8080,()=> {
    console.log("app is listening to the port 8080");
})


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  console.log("connecting to db");
  
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs',ejsMate);

app.use(express.static(path.join(__dirname,"/public")))
 
app.get("/", (req,res)=> {
    res.send("working");
})
//testing route
// app.get("/testListing", wrapAsync(async (req,res)=> {
//     let listing1 =   new Listing({
//         title: "My new villa",
//         description: "Most welcome for family",
//         price: 1200,
//         location:" Canada",
//         country:"Switzerland",
//     });
//     res.send("testing succesfull")
//     await listing1.save()
//         .then(res => {console.log(res)})
//         .catch(err=> {console.log(err)
//     })
// }));


//index Route 
app.get("/listings", wrapAsync( async (req,res)=> {
    const allListings = await Listing.find() ;
    res.render("./listings/index.ejs" , {allListings});
}));




//new route
app.get("/listings/new" , (req,res)=> {
    res.render("./listings/new.ejs") ;
})

//Show route
app.get("/listings/:id" , wrapAsync(async (req,res)=> {
    let { id } = req.params ;
    const listing =  await Listing.findById(id) ;
    res.render("./listings/show.ejs" , { listing });
}));
//create route
app.post("/listings" ,wrapAsync (async (req,res,next)=> {
    let result = listingSchema.validate(req.body) ;
    console.log(result);
    const listing1 =  await new Listing({...req.body.listing});
    await listing1.save()
    res.redirect("/listings");
}) )
//edit route 
app.get("/listings/:id/edit" ,wrapAsync(async  (req,res)=> {
    let { id } = await req.params ;
    let listing = await Listing.findById(id) ;    
    res.render("./listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id" , wrapAsync(async (req,res)=> {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let { id } = req.params ;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}) ;
    res.redirect(`/listings/${id}`);
}))

//delete route
app.delete("/listings/:id" ,wrapAsync(async (req,res)=> {
    let { id } = req.params ;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings")
}))


app.all(/./, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found"));
});


app.use((err,req,res,next)=> {
    let { statusCode = 500, message="something went wrong" } = err ;
    console.log(message);
    res.status(statusCode).render("./error/error.ejs" ,{ message });
})
