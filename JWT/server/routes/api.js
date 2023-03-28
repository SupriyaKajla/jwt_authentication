
const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router()
const dotenv = require('dotenv'); 
const mongoose = require ("mongoose")
const User = require("../models/user")
const bcrypt = require('bcrypt');

mongoose.set('strictQuery', false);

const db = "mongodb+srv://user:user@cluster0.dntdfyv.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(db, err => {
    if(err){
        console.log("error " + err)
    }
    else
    {
        console.log("connected to db")
    }
})

let jwtSecretKey = process.env.JWT_SECRET_KEY; 

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send("Unauthorized request")
    }
    let token = req.headers.authorization.split(" ")[1]
    if(token === "null"){
        return res.status(401).send("Unauthorized request")
    }
    let payload = jwt.verify(token, "jwtSecretKey")
    if(!payload){
        return res.status(401).send("Unauthorized request")
    }
    req.userId = payload.subject
    next()
}

router.get("/", (req, res) => {
    res.send("ROUTING from API")
})

router.get("/events", verifyToken, (req, res) => {
    let events = [
        {
            "_id" : "1",
            "name" : "Career",
            "date" : "Jan 10th 2023",
            "Description": "Online-Lunch-Break MBA General Management"
        },
        {
            "_id" : "2",
            "name" : "Career",
            "date" : "Jan 12th 2023",
            "Description": "Infoabend Bachelor Nachhaltigkeit, Digitalisierung"
        },
        {
            "_id" : "3",
            "name" : "Career",
            "date" : "Jan 18th 2023",
            "Description": "Infoabend Bachelor Technologiemanagement, B.Eng"
        },
        {
            "_id" : "4",
            "name" : "Career",
            "date" : "Jan 22th 2023",
            "Description": "InInfoabend Master Public Management, M.A."
        },
        {
            "_id" : "5",
            "name" : "Career",
            "date" : "Jan 23th 2023",
            "Description": "Study with Deggendorf Institute of Technology"
        },
        {
            "_id" : "6",
            "name" : "Career",
            "date" : "Jan 26th 2023",
            "Description": "Study Biomedicine and Digital Medicine in Germany" 
        },
      ]
    res.json(events)
})


router.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, 8, function(err, hash){
      if(err){
            console.log(err)
              }
          const user = new User({
            email : req.body.email,
            password: hash
        })
        user.save((error, registeredUser) => {
        if(error){
            console.log(error)
        }
        else {
            let payload = {subject : registeredUser._id, expiresIn: 60 * 60  }
            let token = jwt.sign(payload, "jwtSecretKey") 
            {
                algorithm: any = "HS256"

            }
            res.status(200).send({token})
        }
    })

})
})

router.post('/login', (req, res) => {
    let userData = req.body
    User.findOne({email: userData.email}, (err, user) => {
      if (err) {
        console.log(err)    
      } else {
        if (!user) {
          res.status(401).send('Invalid Email')
        } else  
        if (!bcrypt.compare(userData.password, user.password)){
            res.status(401).send('Invalid Password')
            return  
        } else {
          let payload = {subject: user._id, expiresIn: 60 * 60 }
          let token = jwt.sign(payload, "jwtSecretKey")
          {
            algorithm: any = "HS256"

        }
          res.status(200).send({token})
        }
      }
    })
  })

module.exports = router