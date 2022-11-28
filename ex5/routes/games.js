/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: Deidda Paolo
 * /games router
 *
 *
 */

const { request } = require('express');
const express = require('express');
const router = express.Router();
const hs = require('../model/high_scores');
module.exports = router;

let model = require("../model/typing-challenges");

router.get('/typing/challenges.js', (req, res) => {
    res.render("typing-challenges-js", {challenges: model.data});
})

router.get('/typing/challenges', (req, res) => {
    if (request.accepts("html")) {
        res.render("typing-challenges.ejs", {challenges: model.data});
    } else {
        res.status(406).end();
    }
})

router.get('/typing', (req, res) => {
    if (request.accepts("html")) {
        res.render("play-typing-game.ejs", {scoreBoard : hs.data});
    } else {
        res.status(406).end();
    }
})

router.get('/snake', (req, res) => {
    if (request.accepts("html")) {
        res.render("play-snake-game.ejs", {scoreBoard : hs.data});
    } else {
        res.status(406).end();
    }
})

router.get("/typing/challenges", (req, res) => {
    let challenge = {text: req.body.text, 
                    author: req.body.author, 
                    level: req.body.level
                }
    model.data.push(challenge); 
    model.nextId();
    model.save();

    res.redirect(`${game}?player=${p}`);
})

//random game
router.post("/random", (req, res) => {
    let n = Math.random();
    

    if (n <= 0.5) {
        res.redirect("snake");
    } else {
        res.redirect("typing");
    };
})


// game over
router.get("/high_scores/game_over?player&score", (req, res) => {
    res.render("game-over.ejs");
})


router.get("/typing/challenge/:id/edit", (req, res) => {
    let id = req.params.id;
    if (id && id != undefined) {
        res.render("typing-challenges-edit.ejs", {challenge: model.data, id});
    } else {
        res.status(404).end();
    }
})


// router.put("/typing/challenges/:id", (req, res) => {
//     let id = req.param.id;
//     console.log(id);
//     if (id && id != undefined) {
//         model.update_chall(id, {text: req.body.text, author: req.body.author, level: req.body.level})
//     } else {
//         res.status(404).end();

//     }
//     res.redirect("typing-challenges");
// })


router.put('/typing/challenges/:id',(req, res)=> {


    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;  //RegExp object, used to match text with a pattern

    if (format.test(req.body.text)) 
        res.sendStatus(400);

    else {
        // console.log("ciao");
        let id = req.params.id;
        const i = model.data.findIndex(element => element.id == id);
        console.log(i);
        model.update_chall(i, {
            text : req.body.text,
            author : req.body.author,
            level : req.body.level
        });

    res.redirect('/games/typing/challenges', {challenge: model.data, id});
    }
});

router.delete('/typing/challenges/:id', (req, res)=> {
    let id = req.params.id;

    model.delete_chall(id);
    res.redirect('/games/typing/challenges', {challenge: model.data, id});
});