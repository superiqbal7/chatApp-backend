const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const _ = require('lodash');
// const logger = require('morgan');
const app = express();

app.use(cors());

const dbConfig = require("./config/secret");

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const { User } = require('./Helper/UserClass');

require('./socket/streams')(io, User, _);
require('./socket/private')(io);

const auth = require("./routes/authRoutes");
const posts = require("./routes/postRoutes");
const users = require("./routes/userRoute");
const friends = require('./routes/friendsRoutes');
const message = require('./routes/messageRouter');
const image = require('./routes/imageRoutes');

// app.use((req, res, next) => {
//   res.header("Access-Controll-Allow-Origin", "*");
//   res.header("Access-Controll-Allow-Credentials", "true");
//   res.header(
//     "Access-Controll-Allow-Methods",
//     "GET",
//     "POST",
//     "DELETE",
//     "PUT",
//     "OPTIONS"
//   );
//   res.header(
//     "Access-Controll-Allow-Headers",
//     "Origin, X-Requested-with, Content-Type, Accept, Authorization"
//   );
//   next();
// });

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());
// app.use(logger('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/chatapp", auth);
app.use("/api/chatapp", posts);
app.use("/api/chatapp", users);
app.use("/api/chatapp", friends);
app.use("/api/chatapp", message);
app.use("/api/chatapp", image);

server.listen(3000, () => {
  console.log("Running on port 3000");
});
