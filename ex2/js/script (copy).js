

/**
 * Web Atelier 2022 2 - JavaScript
 *
 * Student: Deidda Paolo
 *
 */




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
// bounus 6
function button_quit_click(){
    stopTimer();
}


/**
 * @param {event} a - The input event
 * @return undefined;
 */
function txt_input(event) {
    //game over when input matches challenge length
    if (event.target.value.length === challenge.length) {
        gameOver();
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
