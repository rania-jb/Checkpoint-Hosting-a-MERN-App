var express = require('express');
var router = express.Router();
require("dotenv").config();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = process.env.MONGO_URL;

// GET all items
router.get('/', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("boilerplate");
        dbo.collection("data").find({}).toArray((err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    }); 
});

// POST new item
router.post('/', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db("boilerplate");
        const newItem = {
            name: req.body.name,
            value: req.body.value
        };
        dbo.collection("data").insertOne(newItem, (err, result) => {
            if (err) throw err;
            res.json(result.ops[0]);
            db.close();
        });
    });
});

 

// DELETE item
router.delete('/:id', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db("boilerplate");
        dbo.collection("data").deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
            if (err) throw err;
            res.json({ success: true });
            db.close();
        });
    });
});

// PUT item
router.put('/:id', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db("boilerplate");
        const update = { $set: { name: req.body.name, value: req.body.value } };
        dbo.collection("data").updateOne({ _id: ObjectId(req.params.id) }, update, (err, result) => {
            if (err) throw err;
            res.json({ success: true });
            db.close();
        });
    });
});

module.exports = router;