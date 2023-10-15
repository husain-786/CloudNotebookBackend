const express = require('express')

const router = express.Router()

// importing bcryptjs package....
const bcrypt = require("bcryptjs")

// importing jwt package....
const jwt = require('jsonwebtoken')

const JWT_SECRET = "JWTSECRET"

var fetchuser = require('../middleware/fetchuser')
// importing User Modal or say entity from model file......
const User = require('../models/User') 
const { body, validationResult } = require('express-validator')

// // create a user using: POST "/api/auth/". Doesn't require auth........
// router.post('/', (req, res)=>{
//     // fetching the body of request......
//     console.log(req.body)
//     const user = User(req.body)
//     user.save()
//     res.send(req.body)
// })

//********* ROUTE-1:USER_CREATION **********
// Adding validations......
// create a user using: POST "/api/auth/createUser". Doesn't require auth........
router.post('/createUser', 
    [
        body('name', 'Enter a valid name').isLength({min: 5}),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password must be at least 8 characters').isLength({min: 8}),
    ], 
    async (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error : errors.array()})
        }

        try{
            //generating salt using bcrytjs....... this function return promises......
            const salt = await bcrypt.genSalt(10)       
            // creating a secure password usinf salt...... , this function return promises......
            var securePassword = await bcrypt.hash(req.body.password, salt);
            // User.create returns the promises......
            let user = await User.create({
                name: req.body.name,
                email: req.body.email,
                //password: req.body.password 
                password: securePassword
            })
            // generating token.......
            const data = {
                user:{
                    id:user.id
                }
            }
            // .sign is a sync function then no need to use async and await here......
            const authToken = jwt.sign(data, JWT_SECRET);
            // sending the auth token......
            //res.json(authToken) //returns only the token as a string.....
            res.json({authToken})   // returns auth token in json format with key "authToken" and value as authToken value......
        }
        catch(err) {
            console.log(err)
            res.json({error: "Please enter a unique value for email", message: err.message})
        }
    }
)

//********* ROUTE-2:LOGIN **********
// Login user using: POST "/api/auth/login". Doesn't require auth........
router.post('/login', 
    [
        body('email', 'Enter Correct Credentials').isEmail(),
        body('password', 'Password cannot be blank').exists(),
    ], 
    async (req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error : errors.array()})
        }        

        try{
            // destructuring variables from request body......
            const {email, password} = req.body;
            // we cannot go ahead until the query is executed.... {email} here means {"email":"sajjad@gmail.com"}
            let user = await User.findOne({email})

            if (!user){
                return res.status(400).json({error: "Please Enter Correct Credentials"});
            }

            // checking password.....
            // .compare is a async function so we need to use await......
            const passCheck = await bcrypt.compare(password, user.password)
            if (!passCheck){
                return res.status(400).json({error: "Please Enter Correct Credentials"})
            }

            // generating token.......
            const data = {
                user:{
                    id:user.id
                }
            }
            // .sign is a sync function then no need to use async and await here......
            const authToken = jwt.sign(data, JWT_SECRET);
            // sending the auth token......
            //res.json(authToken) //returns only the token as a string.....
            res.json({authToken})   // returns auth token in json format with key "authToken" and value as authToken value......
        }
        catch(err) {
            console.error(err.message)
            return res.status(500).json({error: "Internal Server Error"});
        }        
    }
)


//********* ROUTE-2:getUserDetails **********
// Login user using: POST "/api/auth/getUserDetails". Require Auth Login........
router.post('/getUserDetails', fetchuser, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-passwrod");
        res.send(user)
    }
    catch(err) {
        console.error(err.message)
        return res.status(500).json({error: "Internal Server Error"});
    }   
})


module.exports = router