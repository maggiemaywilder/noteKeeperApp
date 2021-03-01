// "use strict";
const express = require('express');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');

const db = require('./db/db.json');

const PORT = process.env.PORT || 3000;
const app = express();

// middleware to log: look at adding time and saving log (moment.js/29:00 in travesy video) 
const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}

app.use(express.urlencoded({ extended: true })); // handles url encoded data
app.use(express.json()); //parses json data
app.use(express.static('public'));
// init middleware that logs the 
app.use(logger);


// // return index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// // return notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'))
});

// read the db.json file and return save notes as JSON
app.get("/api/notes", (req, res) => {
    return res.json(db);
})

app.post("/api/notes", (req, res) => {
    const newNote = {
        "id": uuid.v4(), 
        "title": req.body.title,
        "text": req.body.text,
    };
    const notes = db;
    notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        if(err) throw err;
        console.log('File has been saved.');
        return res.json(newNote);
    });
    // do I need to do something to rewrite the file?.... yes? pretty sure
})

app.delete("/api/notes/:id", (req, res) => {
    const deleteId = req.params.id;
    const notes = db;
    console.log(db);
//     // receive the id of note to delete, check all notes fro db.json, remove that one and rewrite the notes to db.json
})



app.listen(PORT, (err) => {
    if(err) {
        console.log(`There was an error: ${err}`);
        return;
    }
    console.log(`Listening on port ${PORT}`);
})