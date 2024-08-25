const express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
var url = "mongodb://localhost:27017/mydb";

app.get('', function (req, res) {
    MongoClient.connect(url, function (err, db) { // kết nối CSDL
        if (err) throw err;
        var dbo = db.db("mydb");
        // Truy vấn trong customers collection
        dbo.collection("customers").find().toArray(function (err, result) {
            if (err) throw err;
            res.render('home', {
                customers: result
            });
            db.close();
        });
    });
});

app.get('/delete/:id', function (req, res) {
    let id = req.params.id;
    MongoClient.connect(url, function (err, db) { // kết nối CSDL
        if (err) throw err;
        var dbo = db.db("mydb");
        // Truy vấn trong customers collection
        dbo.collection("customers").deleteOne({_id: new mongodb.ObjectId(id)}, function(error, result) {
            res.redirect('/');
            db.close();
        })
    });
});
app.get('/edit/:id', function (req, res) {
    let id = req.params.id;
    MongoClient.connect(url, function (err, db) { // kết nối CSDL
        if (err) throw err;
        var dbo = db.db("mydb");
        // Truy vấn trong customers collection
        dbo.collection("customers").findOne({ _id: new mongodb.ObjectId(id)}, function (err, result) {
            if (err) throw err;
            res.render('edit', {
                customer: result
            });
            db.close();
        });
    });
});


app.post('/update/:id', function (req, res) {
    let id = req.params.id;
    MongoClient.connect(url, function (err, db) { // kết nối CSDL
        if (err) throw err;
        var dbo = db.db("mydb");
        // Truy vấn trong customers collection
        let query = { _id: new mongodb.ObjectId(id)};
        let update = { $set: { name: req.body.name, address: req.body.address } };
        dbo.collection("customers").updateOne(query, update, function (err, result) {
            if (err) throw err;
            res.redirect('/');
            db.close();
        });
    });
});


// Tạo route hiển thị form thêm mới
app.get('/add', function (req, res) {
    res.render('add');
});
// Tạo route nhận dữ liệu từ form và thêm mới
app.post('/store', function (req, res) {
    let form_data = req.body;
    MongoClient.connect(url, function (err, db) { // kết nối CSDL
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("customers").insertOne(form_data, function (err, result) {
            if (err) throw err;
            res.redirect('/');
            db.close();
        });
    });
});


app.listen(3000)
