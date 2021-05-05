const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

require('dotenv').config();

//const { sign } = require('jsonwebtoken');
const { createTokens, validateToken } = require("../Middlewares/UserToken");
const { NONE } = require("sequelize");

router.get("/", async (req, res) => {
  const listOfUsers = await Users.findAll();
  res.json(listOfUsers);
});

// router.post("/create", async (req, res) => {
//   const { username, password } = req.body;
//   const user = await Users.findOne({where: {username: username}});
//   if (!user) {
//     bcrypt.hash(password, 10).then((hash) => {
//         Users.create({
//           username: username,
//           password: hash,
//         })
//           .then(() => {
//             res.json(user);
//           })
//           .catch((err) => {
//             if (err) {
//               res.json({ error: err });
//             }
//           });
//     })
//   } else {
//    res.json({error: "username already exisits"});
//   }
// });

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  console.log(username);
  bcrypt.hash(password, 10).then((hash) => {
    console.log(password);
    Users.create({
      username: username,
      password: hash,
      email: email,
    })
      .then(async () => {
        const user = await Users.findOne({ where: { username: username } });
        const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          //secure: true
          //overwrite: true
        })
        console.log(res.cookies);
        res.json("Logged In");
      })
      .catch((err) => {
        if (err) {
          res.json({ error: err });
        }
      });
  });
});

router.post("/login", async (req, res) => {
  // res.cookie("access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEiLCJpZCI6OCwiaWF0IjoxNjIwMTczODU5fQ.2akRPRh-IlyoxMol7O44Fpn2k3iFKa2RMkNxm6nFm7I",
  // {maxAge: 60 * 60 * 24 * 30 * 1000}).send("created")
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "User Doesn't Exist" });
  else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) res.json({ error: "Wrong Username/Password Combination" });
      else {
        const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          //secure: true
          //overwrite: true
        })
        res.json("Logged In");
      }
    });
  }
});

router.get("/profile", validateToken, async (req, res) => {
  res.json(req.user);
});

router.get("/auth", validateToken, async (req, res) => {
  res.json("Auth Confirmed");
})

router.get("/logout", validateToken, async (req, res) => {
  res.clearCookie("access-token");
  res.json("logged out");
});

module.exports = router;