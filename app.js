const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing.js");
app.use(express.urlencoded({extended:true}));

app.listen(8080,()=> {
    console.log("app is listening to the port 8080");
})


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs',ejsMate);

app.use(express.static(path.join(__dirname,"/public")))
 
app.get("/", (req,res)=> {
    res.send("working");
})

app.get("/testListing", async (req,res)=> {
    let listing1 =   new Listing({
        title: "My new villa",
        description: "Most welcome for family",
        price: 1200,
        location:" Canada",
        country:"Switzerland",
    });
    res.send("testing succesfull")
    await listing1.save()
        .then(res => {console.log(res)})
        .catch(err=> {console.log(err)
    })
});


//index Route 
app.get("/listings", async (req,res)=> {
    const allListings = await Listing.find() ;
    res.render("./listings/index.ejs" , {allListings});
});


app.get("/listings/new" , (req,res)=> {
    res.render("./listings/new.ejs") ;
})

//Show route
app.get("/listings/:id" , async (req,res)=> {
    let { id } = req.params ;
    const listing =  await Listing.findById(id) ;
    res.render("./listings/show.ejs" , { listing });
})



app.post("/listings" ,async (req,res)=> {
    let { title, description, image, price, location, country } = req.body ;
    const listing1 = new Listing({
        title: title ,                      //can also edit by using listing[location],listing[titles]like this we can form a listing object with keys names as location and titles and country 
        description: description,               //then use it by     const newlisting = new Listing(req.body.listing)
        image: image ,                                             //     await newlisting.save()
        price: price,
        location: location,                 
        country: country,                       
    })
    listing1.save()
    .then(res=> console.log(res))
    .catch(err=> console.log(err)) ;
    res.redirect("/listings");
})

app.get("/listings/:id/edit" ,async  (req,res)=> {
    let { id } = await req.params ;
    let listing = await Listing.findById(id) ;    
    res.render("./listings/edit.ejs", { listing });
})


app.put("/listings/:id" , async (req,res)=> {
    let { id } = req.params ;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}) ;
    res.redirect("/listings");
})

app.delete("/listings/:id" ,async (req,res)=> {
    let { id } = req.params ;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings")
})

