var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var reservations = require("./database.js").Table("reservations");

var app = express();
var PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var tables = [];
reservations.getItem("isWaitlist", "false").then(function(res){
    tables = res;
});
var waitlist = [];
reservations.getAll("isWaitlist", "true").then(function(res){
    waitlist = res;
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/tables", function (req, res) {
    res.sendFile(path.join(__dirname, "tables.html"));
});

app.get("/reserve", function (req, res) {
    res.sendFile(path.join(__dirname, "reserve.html"));
});

app.get("/api/tables", function (req, res) {
    return res.json(tables);
});

app.get("/api/waitlist", function (req, res) {
    return res.json(waitlist);
});

app.post("/api", function (req, res) {
    var newCustomer = req.body;
    if (tables.length >= 5) {
        waitlist.push(newCustomer);
    }
    else {
        tables.push(newCustomer);
    }
    res.json(newCustomer);
});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
