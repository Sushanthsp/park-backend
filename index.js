const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const connnectDb = require('./config/db.config');
const router = require('./router')
const path = require("path");
const config = require("./config/config");

const app = express();
app.use(cors())
app.use(express.json())

connnectDb()

app.use('/',router)

app.use( (req, res) => {
    res.type("text/plain");
    res.status(404);
    res.send({ success: false, message: "404 Not Found" });
});

app.use( (err, req, res, next) => {
    res.type("text/plain");
    res.status(500);
    res.json({ success: false, message: "500 Server Error", data: err.stack });
    next(err);
});
app.use(express.static(__dirname + "public"));
app.use(express.static(path.resolve(__dirname, "./public")));

app.listen(config.PORT, () => {
    console.log(`App running on http://localhost:${config.PORT}`);
});