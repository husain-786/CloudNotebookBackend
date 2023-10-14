// Step:-1

const mongoose = require('mongoose')

const mongoUri = "mongodb://127.0.0.1:27017/cloudnotebook" 

const connectToMongo = () => {
    try{
        mongoose.connect(mongoUri)
    }
    catch{
        console.log("error in connecting")
    }
}   

module.exports = connectToMongo;    