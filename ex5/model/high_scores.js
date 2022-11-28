/**
 * Web Atelier 2022  Exercise 5 - Web Apps and APIs with Express
 *
 * Student: __Deidda Paolo__
 *
 * high_scores Model
 *
 */

 const fs = require('fs-extra'); // libreria di node per leggere il file-system
 const path = require('path'); // operazione tra i percorsi dei file
 
 let high_scores = [];
 
 //load high scores from the .json file on disk
     //TODO
     try {
         high_scores = JSON.parse(fs.readFileSync('./model/high_scores.json')); // legge i file 
     } catch (e) {}
 
 //write high scores into .json file
 function save() { 
     //TODO
     let hs = JSON.stringify(high_scores); 
     fs.writeFileSync('./model/high_scores.json', hs);
 }
 
 function update_score(newscore) {
     let i = 0;
     while (i < 10) {
         if (high_scores[i] == undefined) {
             high_scores[i] = newscore;
             break;
         } else if (high_scores[i].score < newscore.score) {
             add(newscore, i);
             break;
         }
         i++;
     }
 }
 
 function add(newscore, index) {
     high_scores.splice(index, 0, newscore);
     if (high_scores.length > 10) {
         high_scores.pop();
     }
 }
 
 module.exports = {
     data: high_scores,
     save, 
     update_score
 }