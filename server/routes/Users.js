const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcryptjs");

require('dotenv').config();

const { createTokens, validateToken } = require("../Middlewares/UserToken");
const { NONE } = require("sequelize");
const { sign, verify } = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'doodlebotgame@gmail.com',
    pass: process.env.EMAILPASSWORD
  }
});

router.post("/register", async (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      email: email,
      firstName: firstName,
      lastName: lastName
    })
      .then(async () => {
        const user = await Users.findOne({ where: { username: username } });
        const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          secure: true,
        })
        res.json("Logged In");
      })
      .catch((err) => {
        if (err) {
          res.json({ error: err });
        }
      });
  });
});

router.post("/resetPass", async (req, res) => {
  const { token, password } = req.body;
  try {
    const userToken = await verify(token, process.env.ACCESSTOKEN, { maxAge: 60 * 15 });
    if (userToken) {
      bcrypt.hash(password, 10).then(async (hash) => {
        Users.update({password: hash}, { where: { username: userToken.username}}).then(async () => {
          const user = await Users.findOne({ where: { username: userToken.username } });
          const accessToken = createTokens(user);
          res.cookie("access-token", accessToken, {
            maxAge: 60 * 60 * 24 * 30 * 1000,
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: true,
          })
          res.json("Password Reset");
        }).catch((e) => {
          res.json({error: e});
        })
      });
    }
  } catch (err) {
    console.log('help');
    return res.json({ error: err });
  }
});

router.post("/forgotPass", async (req, res) => {
  Users.findOne({ where: { username: req.body.username } }).then((user) => {
    if (!user) res.json({ error: "User Doesn't Exist" });
    else {
      const accessToken = sign(
        {username: user.username, number: Math.random()},
        process.env.ACCESSTOKEN,
        {expiresIn: 60 * 15}
      );
      const mailOptions = {
        from: 'doodlebotgame@gmail.com',
        to: user.email,
        subject: 'Reset Password',
        html: '<p>Click <a href="https://doodlebot.tech/password/' + accessToken + '">here</a> to reset your password. This link is only valid for 15 minutes.</p>'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json({error: error});
        } else {
          res.json('Email sent: ' + info.response);
        }
      });
      
    }
  }).catch((e) => {
    res.json({error: e});
  })
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const token = req.cookies["access-token"];
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
          secure: true,
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