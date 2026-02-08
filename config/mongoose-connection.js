const mongoose = require("mongoose")
const dbgr = require("debug") ("development:mongoose")
const config = require("config")
//require("dotenv").config() // Load .env variables

// Retrieve MongoDB URI from environment variable
//const mongoURI = process.env.MONGO_URI

mongoose
    .connect(`${config.get("MONGODB_URI")}/scatch`)  // no options needed in Mongoose 7+
    .then(function() {
        dbgr("Connected To The Database")
    })
    .catch(function(err) {
        dbgr(err.name + " " + err.message)
    });

module.exports = mongoose.connection
