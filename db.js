
const mongoose = require("mongoose");

// const mongoUrl = process.env.MONGODB_URL_LOCAL
const mongoUrl = process.env.MONGODB_URL_ATLAS
mongoose.connect(mongoUrl);

const db = mongoose.connection;

db.on("connected", ()=>{
    console.log("MongoDb Connected");
});
db.on("error", (err)=>{
    console.log("error in mongoDb Connection : ",err);
});
db.on("disconnected", ()=>{
    console.log("MongoDb disConnected");
});


module.exports = db;