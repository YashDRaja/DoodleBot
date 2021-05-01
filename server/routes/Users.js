const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const listOfUsers = await Users.findAll();
  res.json(listOfUsers);
});

router.post("/create", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({where: {username: username}});
  if (!user) {
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash
            });
        res.json(user);
    })
  } else {
   res.json("username already exisits");
  }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({where: {username: username}});

    if (!user) res.json({error: "User Doesn't Exist"});
    else {
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) res.json({error: "Wrong Username and Password Combination"});
            else {
                res.json("You Logged In");
            }
        });
    }
  });

module.exports = router;