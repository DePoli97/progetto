/**
 * Web Atelier 2022  - 6 - Persistent Web Apps and APIs with MongoDB
 *
 * Author: __Student_Name__
 *
 * API Client
 *
 * Complete the code using the _fetch* primitives to call the Web API routes
 * implemented in the previous assignments
 *
 */
api = function() {

    /* Quiz 1 */
    function validateResponse(res) {
        /* Quiz 2 */
        if (res.status == 200 || res.status == 201) {
            return res.json();  /* Quiz 3 */
        } if (res.status == 204) {
            return;
        } else {
            throw res.status;
        }
    }

    /* Quiz 4 */
    async function _fetchJSON(method, url, body, headers) {

        /* Quiz 5 */
        function addHeaders(headers) {
            /* Quiz 6 */
            let newHeaders = {...headers};
            /* Quiz 7 */
            newHeaders['Accept'] = 'application/json';
            /* Quiz 8 */
            if (method == 'POST' || method == 'PUT' || method == 'PATCH')
              newHeaders['Content-Type'] = 'application/json';
            return newHeaders;
          }

        /* Quiz 8 */
        if (method === 'POST' || method == 'PUT' || method == 'PATCH') {
            body = JSON.stringify(body);
        }

        /* Quiz 9 */
        const res = await fetch(url, { method, headers: addHeaders(headers), body });
        return validateResponse(res);

    }

    /* Quiz 10 */
    async function _fetchFORM(method, url, body, headers) {

        function addHeaders(headers) {
            let newHeaders = {...headers};
            newHeaders['Accept'] = 'application/json';
            return newHeaders;
          }

        /* Quiz 9 */
        const res = await fetch(url, { method, headers: addHeaders(headers), body });
        return validateResponse(res);

    }

    /* Quiz 11 */
    function get_high_scores() {
        /* Quiz 12 */
        return _fetchJSON("GET", "/high_scores/");
    }

    /* Quiz 13 */
    function save_high_score(score) {
        /* Quiz 14 */
        return _fetchJSON("POST", "/high_scores/", score)
    }

    /* Task 6 */
    function getChallenges() {
    }

    /* Task 8 */
    function getChallenge(id) {
    }

    /* Task 7 */
    function createChallenge(form_data) {
    }

    /* Task 8 */
    function updateChallenge(id, form_data) {
    }

    /* Task 9 */
    function deleteChallenge(id) {
    }

    /* Task 10 */
    function getRandomChallenge() {
    }

    /* Quiz 15 */
    return {
        get_high_scores,
        save_high_score,
        getChallenges,
        getChallenge,
        createChallenge,
        updateChallenge,
        deleteChallenge,
        getRandomChallenge
    }

}(); /* Quiz 16 */