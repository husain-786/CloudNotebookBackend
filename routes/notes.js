const express = require('express')
const router = express.Router()
const fetchuser = require("../middleware/fetchuser")
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator')

// fetching all notes based on user,........
router.get('/fetchAllNotes', fetchuser, async (req, res)=>{
    try{
        const notes = await Notes.find({user: req.user.id})
        res.json(notes)
    }
    catch(err) {
        console.error(err.message)
        return res.status(500).json({error: "Internal Server Error"});
    } 
})

// adding a new Note......      Login required.....
router.post('/addNewNote', fetchuser, 
    [
        body('title', 'Enter a valid name').isLength({min: 3}),
        body('description', 'Description must be at least 5 characters').isLength({min: 5}),
    ],
    async (req, res)=>{
        try{
            const {title, description, tag} = req.body;
            const errors = validationResult(req);
            // if errors exist return the error message............
            if(!errors.isEmpty()){
                return res.status(400).json({error : errors.array()})
            }
            const note = new Notes({
                title, description, tag, user:req.user.id 
            }) 
            const savedNote = await note.save()

            res.json(savedNote)
        }
        catch(err) {
            console.error(err.message)
            return res.status(500).json({error: "Internal Server Error"});
        } 
    }
)

// update exsting note......    Login required....
router.put('/updateNote/:id', fetchuser, 
    [
        body('title', 'Enter a valid name').isLength({min: 3}),
        body('description', 'Description must be at least 5 characters').isLength({min: 5}),
    ],
    async (req, res)=>{
        try{
            const errors = validationResult(req);
            // if errors exist return the error message............
            if(!errors.isEmpty()){
                return res.status(400).json({error : errors.array()})
            }
            
            // finding notes by noteId......
            let notes = await Notes.findById(req.params.id)
            // if notes is not found by id, that means note not present with given id......
            if (!notes){
                return res.status(404).send("Not Found")
            }

            // If the user id in request body and the user id in present in notes details in 
            // database then its an un-authorized access.....
            if (notes.user.toString() !== req.user.id){
                return res.status(401).send("Unauthorized Access");
            }

            // destructuring the request body......
            const {title, description, tag} = req.body;

            // creating new object with requested values.....
            const newNote = {}
            if (title){newNote.title = title}
            if (description){newNote.description = description}
            if (tag){newNote.tag = tag}
            
            // finding by ID and updating.., if not found then set new note in db.....
            notes = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});

            res.json(notes)
        }
        catch(err) {
            console.error(err.message)
            return res.status(500).json({error: "Internal Server Error"});
        } 
    }
)

// delete a note......      Login required.....
router.delete('/deleteNote/:id', fetchuser, 
    async (req, res)=>{
        try{
            const note = await Notes.findById(req.params.id);
            // if note is not present with the given ID, return not found
            if (!note){
                return res.status(404).json({error: "Note With Requested Id Not Found"});
            }

            // check whether the user is valid and deleting its own note......
            // checking whether the user id from fetchuser userId from the note deatisl are same.... 
            if (note.user.toString() !== req.user.id){
                return res.status(401).send("Unauthorized Access");
            }

            // deleting note with requested note ID........
            await Notes.findByIdAndDelete(req.params.id)

            return res.status(200).json({"success":"Note Deleted Successfully!!!", note:note});
        }
        catch(err) {
            console.error(err.message)
            return res.status(500).json({error: "Internal Server Error"});
        } 
    }
)

module.exports = router