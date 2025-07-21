
const mongoose = require('mongoose');

console.log("URL:", process.env.ATLAS_DB_URL);

mongoose.connect(process.env.ATLAS_DB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    console.log("Host:", mongoose.connection.host);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Failed to connect:", err.message);
  });
