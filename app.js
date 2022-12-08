var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var Doc = require('./Docs.model');
var User = require('./User.model');

const port = 3000;

// connect database
mongoose.connect("mongodb://localhost:27017/myDocs-mongoose", (err) => {
    if(!err)
        console.log("Server has been connected to mongodb!!");
})

// adding user
app.post('/addUser', (req, res) => {
    console.log("Adding new user");
    var userObj = {
        "_id": new mongoose.Types.ObjectId(),
        "name": req.body.name
    }
    var newUser = new User(userObj);
    newUser.save((err, user) => {
        if(err)
            res.status(400).send("There is an error while adding new user");
        else
            res.status(200).json(user);    
    })
});

// create API
app.post('/addDoc', (req, res) => {
    console.log("Adding new Doc");
    var docObj = {
        "_id": new mongoose.Types.ObjectId(),
        "title": req.body.title,
        "description": req.body.description,
        "user": "639127c8809ba9c9eedc061f"
    }
    var newDoc = new Doc(docObj);
    newDoc.save((err, doc) => {
        if(err)
            res.status(400).send(err);
        else
            res.status(200).json(doc);    
    })
});

// open home page
app.get('/', (req, res) => {
    res.send("Home Page!");
});

// running port 3000
app.listen(port, () => {
    console.log("App is running in port ", port);
});

// get data
app.get('/docs', (req, res) => {
    console.log("Getting all docs");
    Doc.find({}).populate("user").exec((err, doc) => {
        if(err)
            res.status(400).send(err);
        else
            res.status(200).json(doc);
    })
});

// edit data
app.put('/docs/:id', (req, res) => {
    console.log("Editing a docs");
    var docObj = {
        "title": req.body.title,
        "description": req.body.description
    }
    Doc.findByIdAndUpdate(req.params.id, docObj, {new: true}).exec((err, doc) => {
        if(err)
            res.status(400).send(err);
        else
            res.status(200).json(doc);
    })
});

// delete data
app.delete('/docs/:id', (req, res) => {
    console.log("Delete docs");
    Doc.findByIdAndDelete(req.params.id).exec((err, doc) => {
        if(err)
            res.status(400).send(err);
        else
            res.status(200).json(doc);
    })
});
