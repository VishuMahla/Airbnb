const mongoose = require("mongoose");
const review = require("./review");
const { User } =require("./user");

let Schema = mongoose.Schema ;
const listingSchema = new Schema({
    title:{
        type : String ,

    },
    description:{
        type : String ,

    },
    image:{
        filename : {
            type : String,
            default : "listingImage"
        } ,
        url : {
            type : String ,
        default : "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,
        set:(v) => v === ""?"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                :v,} 
    },
    price:{
        type : Number,
    },
    location:{
        type : String,
    },
    country:{
        type : String,
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "review"
        }
    ],
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete",async (listing)=> {
    if(listing) {
         await review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing ;

