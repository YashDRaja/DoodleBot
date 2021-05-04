const express = require("express");
const router = express.Router();
const { Users, Games } = require("../models");

const { validateToken } = require("../Middlewares/UserToken");

router.get("/", async (req, res) => {
    const listOfGames = await Games.findAll();
    res.json(listOfGames);
});


router.post("/create", validateToken, async (req, res) => {
    const { given_word, guessed_word, game_type } = req.body;
    console.log(req.user);
    const user = await Users.findOne({ where: { username: req.user.validToken.username } });
    user.createGame({
        given_word: given_word,
        guessed_word: guessed_word,
        game_type:game_type
    })
        .then(() => {
            res.json({});
        })
        .catch((err) => {
            if (err) {
                res.json({ error: err });
            }
        });

});


router.get("/profile", validateToken, async (req, res) => {
    const user = await Users.findOne({ where: { username: req.user.validToken.username } });
    const games = await user.getGames();
    res.json(games);
});

module.exports = router;