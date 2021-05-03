const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

require('dotenv').config();

//const { sign } = require('jsonwebtoken');
const { createTokens, validateToken } = require("../Middlewares/UserToken");

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

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    })
      .then(() => {
        res.json(user);
      })
      .catch((err) => {
        if (err) {
          res.json({ error: err });
        }
      });
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({where: {username: username}});

  if (!user) res.json({error: "User Doesn't Exist"});
  else {
      bcrypt.compare(password, user.password).then((match) => {
          if (!match) res.json({error: "Wrong Username/Password Combination"});
          else {
            const accessToken = createTokens(user);
            res.cookie("access-token", accessToken, {
              maxAge: 60 * 60 * 24 * 30 * 1000,
              httpOnly: true,
            })
            res.json("Logged In");
          } 
      });
  }
});

router.get("/profile", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/auth", validateToken, (req, res) => {
  res.json("Auth Confirmed");
})

router.get("/logout", validateToken, (req, res) => {
  res.clearCookie("access-token");
  res.json("logged out");
});

module.exports = router;