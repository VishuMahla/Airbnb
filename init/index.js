const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initdb = async () => {
    await Listing.deleteMany({});
    console.log("all data deleted");
    initData.data = initData.data.map((obj)=> ({ ...obj, owner: "6865634b26a8c4ce99592d3b"}) );
    await Listing.insertMany(initData.data);
    console.log("new data inserted");
}
initdb() ;