const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());


app.use(cookieParser());
app.use(cors({credentials:true, origin: "http://localhost:3000"}));

const db = require("./models");


// Routers
const userRouter = require("./routes/Users");
app.use("/users", userRouter);

const gameRouter = require("./routes/Games");
app.use("/game", gameRouter);

const modelRouter = require("./routes/Model");
app.use("/model", modelRouter);


db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});