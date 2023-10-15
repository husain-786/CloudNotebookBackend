const mongoose = require("mongoose")

// importing Schema from mongoose....
const {Schema} = mongoose;

// creating schema for User.....
const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
        default: "general"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('notes', NotesSchema)