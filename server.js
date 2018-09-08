var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var Table = require("./database.js")
var reservations = new Table("RESERVATIONS");
reservations.connect();


var app = express();
var PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var tables = [];
reservations.getItem("isWaitlist", "0").then(function (res) {
    tables = res;
});
var waitlist = [];
reservations.getItem("isWaitlist", "1").then(function (res) {
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
        newCustomer.isWaitlist = 1;
        waitlist.push(newCustomer);
    }
    else {
        newCustomer.isWaitlist = 0;
        tables.push(newCustomer);
    }
    reservations.newItem(newCustomer).then(function (response) {
        console.log(response)
    });
    res.json(newCustomer);
});

app.post("/api/clear", function (req, res) {
    var pword = req.body.pword;
    if (pword != "caliente") {
        res.send("ACCESS DENIED");
    }
    else {
        tables = [];
        waitlist = [];
        reservations.deleteItem("user_id", 0, ">").then(function (response) {
            console.log(response);    
        });
        res.send("DATABASE CLEARED");
    }
});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
