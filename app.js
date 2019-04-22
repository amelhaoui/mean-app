global.__basedir = __dirname;

const createError = require('http-errors');

const express = require('express');
const mongoose = require('mongoose');

const carsRouter = require('./routes/Cars');
const stationsRouter = require('./routes/Stations');

const DB_URL = 'mongodb://localhost/virtuo-backend';
mongoose.connect(DB_URL, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("connected to db");
});


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/Stations', stationsRouter);
app.use('/Cars', carsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError.NotFound());
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    let error = err;
    console.error(err);
    if (req.app.get('env') !== 'development') {
        error = createError.InternalServerError();
    }

    res.status(error.status).send(error);
});

module.exports = app;
