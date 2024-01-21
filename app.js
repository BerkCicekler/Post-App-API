const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

const userRoutes = require('./api/routes/users');
const postRoutes = require('./api/routes/posts');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:  "Unexpected error",
        message: error.message
        
    });
})

module.exports = app;