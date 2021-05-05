const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());
app.use(cookieParser());

const db = require("./models");


// Routers
const userRouter = require("./routes/Users");
app.use("/users", userRouter);

const gameRouter = require("./routes/Games");
app.use("/game", gameRouter);

app.get('*', (req, res)=>{  res.sendFile(path.join(__dirname, '../build/index.html'));})

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});