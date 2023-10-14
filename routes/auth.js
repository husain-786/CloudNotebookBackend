const express = require('express')

const router = express.Router()

// importing bcryptjs package....
const bcrypt = require("bcryptjs")

// importing jwt package....
const jwt = require('jsonwebtoken')

const JWT_SECRET = "JWTSECRET"

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

        //generating salt using bcrytjs....... this function return promises......
        const salt = await bcrypt.genSalt(10)       
        // creating a secure password usinf salt...... , this function return promises......
        var securePassword = await bcrypt.hash(req.body.password, salt);
        // User.create returns the promises......
        await User.create({
            name: req.body.name,
            email: req.body.email,
            //password: req.body.password 
            password: securePassword
        }).then(user => res.json(user))
        .catch(err => {
            console.log(err)
            res.json({error: "Please enter a unique value for email", message: err.message})
        })
    }
)

module.exports = router