/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: Deidda Paolo
 *
 * /index.html router
 *
 */

// const { append } = require('cheerio/lib/api/manipulation');
const express = require('express'); 
const router = express.Router();
const hs = require('../model/high_scores');
const cs = require('../model/typing-challenges');
module.exports = router;

router.get(["/", "index", "/index.html"], (req, res)=> {
    res.render('index', {scoreBoard : hs.data});
})

router.get("/edit", (req, res) => {
    res.render("typing-challenges.ejs", {challenges: cs.data});
})
