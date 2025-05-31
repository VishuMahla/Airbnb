const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

let Schema = mongoose.Schema ;
const listingSchema = new Schema({
    title:{
        type : String ,

    },
    description:{
        type : String ,

    },
    image:{
        filename :{
            type: String ,
            default : "listingimage" ,
        } ,
        url : {
            type : String ,
        default : "https://images.unsplash.com/photo-1747573284015-80d26930c9f1?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,
        set:(v) => v === ""?"https://images.unsplash.com/photo-1747573284015-80d26930c9f1?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                :v,
        }
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
});


const Listing = mongoose.model("Listing", listingSchema);


module.exports = Listing ;

