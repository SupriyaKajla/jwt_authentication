const mongoose = require ("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        index: {
            unique: true
        },
        match:/^\S+@\S+\.\S+$/
    },
    password:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("user", userSchema, "users")