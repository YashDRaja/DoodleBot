const express = require("express");
const router = express.Router();
const { Users, Games } = require("../models");

const { validateToken } = require("../Middlewares/UserToken");
const { response } = require("express");

router.get("/", async (req, res) => {
    const listOfGames = await Games.findAll();
    res.json(listOfGames);
});


router.post("/create", validateToken, async (req, res) => {
    const { rounds, game_type, score } = req.body;

    const user = await Users.findOne({ where: { username: req.user.validToken.username } });
    user.createGame({
        game_type: game_type,
        score: score
    })
        .then((game) => {
            (async () => {
                for (let i = 0; i < rounds.length; i++) {
                    game.createRound({
                        given_word: rounds[i].given_word,
                        guessed_word: rounds[i].guessed_word,
                        round_num: rounds[i].round
                    }).catch((e) => {
                        res.json({ error: e });
                    })
                }
                res.json({});
            })()
        })
        .catch((err) => {
            if (err) {
                res.json({ error: err });
            }
        });
});


router.get("/profile", validateToken, async (req, res) => {
    const user = await Users.findOne({ where: { username: req.user.validToken.username } });
    console.log('start');
    user.getGames().then(async (userGames) => {
        let games = [];
        if (userGames.length == 0) {
            res.json([]);
        }
        for (let i = 0; i < userGames.length; ++i) {

            await userGames[i].getRounds().then((response) => {
                try {
                    games.push({ game_type: userGames[i].game_type, rounds: response, score: userGames[i].score })
                    if (i == userGames.length - 1) {
                        res.json(games);
                    }
                } catch (e) {
                    res.json({ error: "No rounds" });
                }
            });
        }
    }).catch((e) => {
        console.log(e);
    })

});

module.exports = router;