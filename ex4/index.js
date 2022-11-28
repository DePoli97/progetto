/**
 * Web Atelier 2022  Exercise 4 - JavaScript on the Server-side
 *
 * Student: _Deidda Paolo_
 *
 * Web Server
 *
 */

/* Quiz 1 */ // Import the dependencies from node_modules
const http = require("http");

//Useful module to work with the file system
const fs = require("fs-extra");

let site_path = "./public";

/* Quiz 2 */ // Import the local dependencies
const tictactoe = require("./modules/play-tictactoe-game");
const { pathExistsSync } = require("fs-extra/lib/path-exists");


function download(urlpath, response) {
    const localPath = site_path + unescape(urlpath)

    /* Quiz 3 */ // Attempt to read the content of a local file
    const file = fs.createReadStream(localPath);

    file.on('error', function(err) {
        switch (err.code) {
            case 'ENOENT':
                console.log(`File ${localPath} does not exist.`);
                /* Quiz 4 */ // File does not exist, hence the URL has not been found
                response.writeHead(404);
                response.end();
                break;
            case 'EISDIR':
                /* Quiz 5 */ // It is not allowed to read the content of directories
                response.writeHead(401);
                response.end();
                break;
            default:
                console.log('Error: ' + err);
                throw err;
        }
        return;
    });


    //TODO - the Content-Type should be set depending on the filename extension
    response.writeHead(200);

    /* Quiz 6 Send the content of the local file to the browser */
    file.pipe(response);
}

/* Quiz 7 Main request handler function of the Web server */
function onrequest(request, response) {
    //URL
    let url = request.url;
    if (url === "/") {
        response.writeHead(302, { 'Location': "/tic-tac-toe/_________?scoreX=0&scoreO=0&ties=0", 'Content-Type':'text/html'});
        response.end();
        return;
    }
    console.log("l url e': " + url);

    
    if (url.endsWith(".css")) {
        download(url, response);
        return;
    }

    url = new URL(url, 'http://localhost:8888');
    
    response.writeHead(200, { 'Content-Type': 'text/html' });
    

    if ((url + "").includes("tic-tac-toe")) {
        let current_player, current_game_state;
        console.log("----------------------" + url.pathname.split("/"));
        //game
        if (url.pathname.split("/").length === 3) {
            current_player = "o";
        } else {
            current_player = url.pathname.split("/")[3];
        }
        current_game_state = url.pathname.split("/")[2];
        console.log("1:" + current_game_state);

        next_player = current_player === "x" ? "o" : "x";

        let dialog = "";
        let state = "";
        let won = false;
    
        //score
        let scoreX = parseInt(url.searchParams.get("scoreX")); 
        let scoreO = parseInt(url.searchParams.get("scoreO"));
        let ties = parseInt(url.searchParams.get("ties"));

        //
        if (tictactoe.win(current_game_state)) {
            won = true;
            dialog = next_player.toUpperCase() + " won the game!";
            state = "win";
            (next_player === "x" ? scoreX++ : scoreO++);
        } else if (!current_game_state.includes("_")) {
            dialog = "tie!";
            state = "tie"
            ties++;
        }
        console.log("NNNNNNNNNN " + current_game_state + " " + current_player + " " + url + " " + scoreX + " " + scoreO + " " + ties + " " + won);

        //html
        const head = `<head><link rel="stylesheet" href="/play-tictactoe-game.css"><style type="text/css"></style></head>`;
        let body = `<body class="${state}">                        
                        <main>
                            <div class="score made">
                                <h1>O score: ${scoreO}</h1>
                                <h1>X score: ${scoreX} </h1>
                                <h1>ties: ${ties}</h1>
                            </div>
                            <div class="winner">
                                <p class="dialog">${dialog}</p>
                            </div>
                            <div class="made">
                                <button><a href="${won ? "" : column_button(current_game_state, 0, current_player, url, scoreX, scoreO, ties)}">C1</a></button>
                                <button><a href="${won ? "" : column_button(current_game_state, 1, current_player, url, scoreX, scoreO, ties)}">C2</a></button>
                                <button><a href="${won ? "" : column_button(current_game_state, 2, current_player, url, scoreX, scoreO, ties)}">C3</a></button>
                            </div>
                            <div class="grid">
                                ${tags_links(current_game_state, current_player, url, scoreX, scoreO, ties, won)}
                            </div>
                            <div class="made">
                                <button><a href="/tic-tac-toe/_________/${current_player}?scoreX=${scoreX}&scoreO=${scoreO}&ties=${ties}">CONTINUE</a></button>
                                <button><a href="${won ? "" : current_game_state.includes("_") ? bot(current_game_state, current_player, url, scoreX, scoreO, ties) : ""}">BOT</a></button>
                                <button><a href="/">RESET</a></button>
                            </div>
                        </main>
                    </body>`
    
        //print
        response.write("<html>" + head + body + "</html>");
        response.end();
    } else {
        /* Quiz 8 By default all requests are not found */ 
        response.writeHead(404); //not found
        response.end();
    }
}

/* Quiz 9 Start the HTTP server using the main request handler function */
http.createServer(onrequest).listen(8888);


////////////////////////////////////////////////////////////////////////////////////////
//generate the next links
function next_state_link(s, pos, currentP, url, scoreX, scoreO, ties){
    let nextP = currentP === "x" ? "o" : "x";
    if (s[pos] === "_") {
        let newGameState = ""
        for (let i = 0; i < s.length; i++) {
            if (i === pos) {
                newGameState = newGameState + currentP;
            } else {
                newGameState = newGameState + s[i];
            }
        }
        return url.origin + "/" + url.pathname.split("/")[0] + "tic-tac-toe" + "/" + newGameState + "/" + nextP + "?scoreX=" + scoreX + "&scoreO=" + scoreO + "&ties=" + ties;
    } else {
        return "";
    }
}
// take the links and place them in the correct tags
function tags_links(s, currentP, url, scoreX, scoreO, ties, won) {
    let tags = "";
    for (let i = 0; i<9; i++) {
        link = next_state_link(s, i, currentP, url, scoreX, scoreO, ties);
        if (s[i] === "_" && !won) {
            tags = tags + `<b><a href="${link}">${s[i]}</a></b>`
        } else {
            tags = tags + `<b>${s[i]}</b>`
        }
    }
    return tags;
}


// bot
function bot(s, currentP, url, scoreX, scoreO, ties) {
    let nextP = currentP === "x" ? "o" : "x";

    if (!s.includes("_")) {
        return s;
    }
    let botPos = 0;
    
    //find the first free random position
    do {
        botPos = Math.round((Math.random() *s.length) -0.5);
    } while (s[botPos] != "_");

    //rewrite the string
    let newGameState = "";
        for (let i = 0; i < s.length; i++) {
            if (i === botPos) {
                newGameState = newGameState + currentP;
            } else { 
                newGameState = newGameState + s[i];
            }
        }
    console.log(url)
    return url.origin + "/" + url.pathname.split("/")[0] + "tic-tac-toe" + "/" + newGameState + "/" + nextP + "?scoreX=" + scoreX + "&scoreO=" + scoreO + "&ties=" + ties;
}

// column choice
function column_button(s, col, currentP, url, scoreX, scoreO, ties) {
    let nextP = currentP === "x" ? "o" : "x";
    let newGameState = "";

    s = [[s[0], s[1], s[2]], [s[3], s[4], s[5]], [s[6], s[7], s[8]]];
    for (let i = 2; i >= 0; i--) {
        if (s[i][col] === "_") {
            s[i][col] = currentP;
            break;
        } else if (i === 0) {
            nextP = nextP === "x" ? "o" : "x";
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            newGameState = newGameState + s[i][j];
        }
    }
    return url.origin + "/" + url.pathname.split("/")[0] + "tic-tac-toe" + "/" + newGameState + "/" + nextP + "?scoreX=" + scoreX + "&scoreO=" + scoreO + "&ties=" + ties;
}