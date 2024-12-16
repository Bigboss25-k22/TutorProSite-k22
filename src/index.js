const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const socketHandler = require('./util/socketHandler');
const route = require('./routes');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Kết hợp HTTP server với Express
const server = http.createServer(app);
const io = socketIo(server);

// Connect to database
db.connect();

// CORS Middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.options('*', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.sendStatus(200);
});

// Template engine
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  helpers: require('./helpers/handlebars'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
route(app);

// Socket.IO handler
socketHandler(io);

// Server listening
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});