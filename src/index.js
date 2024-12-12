const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const route = require('./routes');
const db = require('./config/db');

db.connect();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// template engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: require('./helpers/handlebars')
  }));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));


app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

