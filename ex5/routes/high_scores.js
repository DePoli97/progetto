/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: Deidda Paolo
 *
 * /high_scores router
 *
 */


const { request } = require('express');
const express = require('express');
const router = express.Router();
const hs = require('../model/high_scores');
module.exports = router;

router.get('/game_over', (req, res) => {
    if (request.accepts("html")) {
        res.render("game_over", {score: req.query.score, time: req.query.time, player: req.query.player});
    } else {
        res.status(406).end();
    }
});

router.post('/', (req, res)=> {
    hs.update_score({
        player : req.body.player, 
        score : req.body.score,
        time: req.body.time
    });

    hs.save();
    res.redirect("index.html");
});

