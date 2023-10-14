// Step:-2
const connectToMongo = require('./db');

connectToMongo()


// Step-3:-  npm i -D nodemon   
// Using -D to make nodemon a devDependency but not the Application Properties Dependncy

const express = require('express')
const app = express()
const port = 3000

// A middlewere used that will help to get the body of request.....
app.use(express.json())

app.get('/', (req, res)=>{
    res.send("Hi")
})

// Available Routes......
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})





// // connecting without using db.js

// const express = require('express')
// const app = express()

// const mongoose = require('mongoose')
// const url = "mongodb://127.0.0.1:27017/cloudnotebook"
// // const url = "mongodb://localhost:27017/cloudnotebook"

// mongoose.connect(url)

// app.get('/', (req, res)=>{
//     res.send("Hi Husain");
// })

// app.get('/api/v1/login', (req, res)=>{
//     res.send("login");
// })

// app.get('/api/v1/signup', (req, res)=>{
//     res.send("Sign up");
// })

// app.listen(5000, ()=>{
//     console.log("Server is running on Port : 5000");
// })