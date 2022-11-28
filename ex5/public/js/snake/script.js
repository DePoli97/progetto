/**
 * Web Atelier 2022 2 - JavaScript
 *
 * Student: Deidda Paolo
 *
 */

//--------------------------------------------------------------------------------------
// Task 1
//--------------------------------------------------------------------------------------

/**
 * @param {number} s - A time as the number of seconds.
 * @return {string} A string which represents the number of minutes followed by the remaining seconds
 *  with the M:SS.MS format. If the input value is negative, the resulting string should be in -M:SS.MS format.
 * SS indicates that if the number of seconds is less than 10, it should be padded with a 0 character.
 * MS indicates the number of milliseconds (3 digits)
 */
 function format_seconds(s) {
    if (isNaN(s) || typeof(s) !== "number") {return "?:??.????";}
    if (s == 0) {
        return "0:00.000";
    } 
    if (s < 0) {
        format_seconds(s *-1);
        let positive = format_seconds(s *-1);
        return '-' + positive;
    } else {
        let min = Math.trunc(s / 60);
        let sec = (Math.trunc(s % 60).toString()).padStart(2,"0");
        let millisec = Math.round((1000 * (s - Math.trunc(s))).toFixed(3));
        return min+":"+sec+"."+millisec;
    }
}
    

/**
* @param {Number[]} a - The array of numbers.
* @param {Number} c - The scalar multiplier.
* @return {Number[]} An array computed by multiplying each element of the input array `a`
* with the input scalar value `c`.
*/
function scalar_product(a, c) {
    if (a == undefined  || c == undefined || !Array.isArray(a)) {
        return undefined;
    }
    return a.map( function x(el) {return el*c})
}


/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number} A value computed by summing the products of each pair
 * of elements of its input arrays `a`, `b` in the same position.
 */
 function inner_product(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length != b.length) {return undefined}
    let sum = 0;
    for(let i = 0; i < a.length; i+=1) {
        sum = a[i]*b[i];
    }
    return sum;
}


/**
 * @param {String} a - A string typed by the user
 * @param {String} b - The correct string
 * @return {Array[Boolean]} Array indicating whether the corresponding characters are wrong: (true = mismatch detected, false = identical characters).
 */
function getErrors(a, b) {
    logFunctionArguments(arguments);
    if(a == undefined || b == undefined) {return undefined};
        let sol = [];
        for (let i = 0; i < a.length; i++) {(a[i] == b[i] ? sol.push(false) : sol.push(true))};
    return sol;
}



/**
* @param {String} a - A string typed by the user
* @param {String} b - The correct string
* @return {Integer} The number of mismatching characters. Case sensitive.
*/
function countErrors(a, b) {
    if (a == undefined || b == undefined) {return undefined};
    let counter = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {counter++};
    }
    return counter;
}

/**
 * Detect whether the point at coordinates (x,y) is found within the given rectangle
 * @param {Integer} x
 * @param {Integer} y
 * @param {Integer} left
 * @param {Integer} top
 * @param {Integer} width
 * @param {Integer} height
 * @returns {Boolean} true, if the point is located inside (including the edge), false outside
 */
function detectCollisionRect(x, y, left, top, width, height) {
    return (left <= x && x <= left + width) && 
           (top <= y && y <= top + height);
}

/**
 * Detect whether the point at coordinates (x,y) is found within any of the given rectangles
 * @param {Integer} x
 * @param {Integer} y
 * @param {Array} a Array of rectangles. Each rectangle is an array of 4 elements: [left, top, width, height].
 * @returns
 */
function detectCollisionRectArray(x, y, a) {
    if ((!Array.isArray(a)) || (a.length === 0) || (x === undefined) || (y === undefined) || (a === undefined)) {return undefined;}
    for (let i = 0; i < a.length; i++) {
        if ((a[i][0] <= x && x <= a[i][0] + a[i][2]) && 
             (a[i][1] <= y && y <= a[i][1] + a[i][3])) {
            return true;
        }
    }
    return false;
}



//--------------------------------------------------------------------------------------
// Task 2
//--------------------------------------------------------------------------------------


/**
* @param {string} t0 - A timestamp
* @return {function(t)} A function which given a timestamp t computes the time elapsed since the initial timestamp t0.
*/
function startClock(t0) {
    if (!isNaN(t0)) {
        return function getElapsedTime(t) {
            return t - t0;
        }
    }
}


/**
 * @param {number[]} a - The array over which to iterate.
 * @return {function} - call this function to retrieve the next element of the array. The function throws an error if called again after it reaches the last element.
 */
function iterator(a) {
    if (!Array.isArray(a)) {return undefined;}
    let pos = 0;
    function next(b) {
        if (b == null) {
            if (pos >= a.length) {
                throw new Error("Exceded Limits");
            }
            pos++;
            return a[pos -1]; // -1 so I update pos before returning
        } 
        if (Array.isArray(b)) {
            pos = 0;
            a = b;
            return next;
        }
        if (a.lenght === 0) {return next;}
        if (typeof(b) == "number") {
            if (b == 0) {
                return pos;
            }
            pos = pos +b; // dunno why without -1 does not work and would return the pos after it...
            if (pos < 0) {pos = 0}
        }
    }
    return next;
}


/**
 * @param {event} a - The click event
 * @return undefined;
 */
/**
 * @param {event} a - The click event
 * @return undefined;
 */
function button_start_click(event) {
    //start the clock
    
    getElapsedTime = startClock(performance.now());

    //start the timer event
    stopTimer = startTimer(tick);

    //pick a random text challenge and display it
    challenge = pickRandomChallenge();
    displayChallenge(challenge);

    //get the <input> ready for the next round
    emptyInput();
    focusInput();
    input_text.style.opacity = 1;
    //reset the score
    score();
}




/**
 * @param {event} a - The input event
 * @return undefined;
 */
function txt_input(event) {
    //game over when input matches challenge length
    if (event.target.value.length === challenge.length) { //input_text.target.lenght
        gameOver();                                       //dall event listener
    }

    //count errors and display them
    let ce = countErrors(event.target.value, challenge);
    displayErrors((challenge.length - ce) / challenge.len)

    score();
    let count = countErrors(event.target.value, challenge);
    errorperc = count/event.target.value.length;
    displayErrors(1-errorperc);

    //update the score based on the errors
    score(event.target.value.length - count);

    //redisplay the challenge string to highlight the errors
    let redisplay = getErrors(event.target.value,challenge);
    displayChallenge(challenge, redisplay);   
}


/**
 * Helper function to print a log message with the function call performed by the tests
 *
 * usage:
 *
 * logFunctionArguments(arguments);
 */
 function logFunctionArguments(a){

    console.log(`${a.callee.name}(${Array.from(a).map(j=>JSON.stringify(j)).join(", ")})`)

}
