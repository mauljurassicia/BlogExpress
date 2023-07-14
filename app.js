require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const mongo_Store = require('connect-mongo');
const session = require('express-session');
const methodOverride = require('method-override');


const app = express();
const PORT = process.env.PORT || 5000;

//connect to database
connectDB();
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUninitialized: true,
    store: mongo_Store.create({
        mongoUrl: process.env.MONGODB_URI
    })

}
    
))

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`);
})

