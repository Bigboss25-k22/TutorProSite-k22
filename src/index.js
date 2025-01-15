const path = require("path");
const express = require("express");
const handlebars = require("express-handlebars");
const http = require("http");
const { Server } = require("socket.io");
const route = require("./routes");
const db = require("./config/db");
const { initSocket } = require("./socket");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Kết hợp HTTP server với Express
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3001"], // Frontend URLs
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Kết nối cơ sở dữ liệu
db.connect();

// CORS Middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Xử lý OPTIONS request
app.options("*", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.sendStatus(200);
});

// Template engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    helpers: require("./helpers/handlebars"),
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Khởi tạo routes
route(app);

// Khởi tạo Socket.IO
initSocket(io);

// Lắng nghe server
server.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
