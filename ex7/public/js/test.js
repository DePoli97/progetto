/**
 * Web Atelier 2022 7 - Single-Page Web Applications with Fetch and Client-side Views
 *
 * Automated Tests Cases
 *
 */

let api;

function loadGame(t = 500) {
    return new Promise((resolve, reject) => {
        let x = document.querySelector("iframe");
        x.src = "index.html";
        x.onload = function () {
            var y = (x.contentWindow || x.contentDocument);
            // console.log(y.api);

            /*
            console.log(y.fetch);

            y.fetch = new Proxy(y.fetch, {
                apply(fetch, that, args) {
                    // Forward function call to the original fetch
                    const result = fetch.apply(that, args);

                    // Do whatever you want with the resulting Promise
                    result.then((response) => {
                        console.log("fetch completed!", args, response);
                    });

                    return result;
                }
            });
*/
            api = y.api;
            wait(t).then(() => resolve(y.document));
        }
        x.onerror = function (e) {
            reject(e);
        }
    });
}

function wait(t) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, t);
    });
}

function randomText(length = 20) {
    return (Math.random().toString(16) + Math.random().toString(16)).substring(2, length);
}

describe('Task 2', function () {

    describe('GET / retrieves the static homepage', function () {

        it('should include link to the typing game', function () {

            return loadGame(0).then(y => {

                should.exist(y.querySelector("a[href='/games/typing']"));

            });

        });

        it('should include link to the snake game', function () {

            return loadGame(0).then(y => {

                should.exist(y.querySelector("a[href='/games/snake']"));

            });

        });

        it('should include link to edit the typing game challenges', function () {

            return loadGame(0).then(y => {

                should.exist(y.querySelector("a[href='/games/typing/challenges']"));

            });

        });

        it('should display high scores container element', function () {

            return loadGame(0).then(y => {

                should.exist(y.querySelector("aside") || y.querySelector("sidebar"));

            });

        });

        it('should display player name input text field', function () {

            return loadGame(0).then(y => {

                should.exist(y.querySelector("input[id='player'][type='text']"));

            });

        });

    });

});


describe('Task 3', function () {

    describe('display high scores', function () {

        it('should display high scores inside container element', function () {

            return loadGame(200).then(y => {

                should.exist(y.querySelector("aside") || y.querySelector("sidebar"));

                let hs_html = (y.querySelector("aside") || y.querySelector("sidebar")).innerHTML;

                should(true).be.equal(hs_html.length > 0);

                return api.get_high_scores().then(a => {
                    a.forEach(o => {

                        should(true).be.equal(hs_html.indexOf(o.player || "") >= 0);
                        should(true).be.equal(hs_html.indexOf(o.score || "") >= 0);

                    })
                })

            });

        });

    });

});


describe('Task 4 and 6', function () {



    describe('display snake game', function () {

        it('should not change the location when clicking on the snake game link', function () {

            return loadGame(0).then(y => {

                let old_href = document.querySelector("iframe").contentWindow.location.href;

                y.querySelector("a[href='/games/snake']").click();

                return wait(200).then(() => {

                    should(document.querySelector("iframe").contentWindow.location.href).be.equal(old_href);

                })

            });

        });

        it('should change the main element content', function () {

            return loadGame(0).then(y => {

                let old_main = y.querySelector("main").innerHTML;

                y.querySelector("a[href='/games/snake']").click();

                return wait(200).then(() => {

                    should(y.querySelector("main").innerHTML).not.be.equal(old_main);

                })

            });

        });

    });


    describe('display typing game', function () {

        it('should not change the location when clicking on the typing game link', function () {

            return loadGame(0).then(y => {

                let old_href = document.querySelector("iframe").contentWindow.location.href;

                y.querySelector("a[href='/games/typing']").click();

                return wait(200).then(() => {

                    should(document.querySelector("iframe").contentWindow.location.href).be.equal(old_href);

                })

            });

        });

        it('should change the main element content', function () {

            return loadGame(0).then(y => {

                let old_main = y.querySelector("main").innerHTML;

                y.querySelector("a[href='/games/typing']").click();

                return wait(200).then(() => {

                    should(y.querySelector("main").innerHTML).not.be.equal(old_main);

                })

            });

        });

    });


    describe('display typing game editor', function () {

        it('should not change the location when clicking on the typing game editor link', function () {

            return loadGame(0).then(y => {

                let old_href = document.querySelector("iframe").contentWindow.location.href;

                y.querySelector("a[href='/games/typing/challenges']").click();

                return wait(200).then(() => {

                    should(document.querySelector("iframe").contentWindow.location.href).be.equal(old_href);

                })

            });

        });

        it('should change the main element content', function () {

            return loadGame(0).then(y => {

                let old_main = y.querySelector("main").innerHTML;

                y.querySelector("a[href='/games/typing/challenges']").click();

                return wait(200).then(() => {

                    should(y.querySelector("main").innerHTML).not.be.equal(old_main);

                })

            });

        });

    });


});


describe('Task 6', function () {

    describe('display typing game editor', function () {

        it('should display challenges inside container element', function () {

            return loadGame(200).then(y => {

                y.querySelector("a[href='/games/typing/challenges']").click();

                return wait(200).then(() => {

                    should.exist(y.querySelector(".list"));

                    let cs_html = (y.querySelector(".list")).innerHTML;

                    return api.getChallenges().then(a => {
                        a.forEach(o => {

                            should(true).be.equal(cs_html.indexOf(o.text || "") >= 0);
                            should(true).be.equal(cs_html.indexOf(o.author || "") >= 0);

                        })
                    })

                });

            });

        });

        it('should include a form to create a new challenge', function () {

            return loadGame(0).then(y => {

                y.querySelector("a[href='/games/typing/challenges']").click();

                return wait(200).then(() => {

                    should.exist(y.querySelector("form[action='/games/typing/challenges'][method='post']"));
                });

            });

        });

        it('should include a form to create a new challenge with the text, author, level fields', function () {

            return loadGame(0).then(y => {

                y.querySelector("a[href='/games/typing/challenges']").click();

                return wait(200).then(() => {

                    should.exist(y.querySelector("form[action='/games/typing/challenges'][method='post'] input[name='text']"));
                    should.exist(y.querySelector("form[action='/games/typing/challenges'][method='post'] input[name='author']"));
                    should.exist(y.querySelector("form[action='/games/typing/challenges'][method='post'] input[name='level']"));

                });

            });

        });

    });

});

    let text = randomText();
    let author = randomText(8);
    let level = Math.round(Math.random() * 10);

    describe('Task 7', function () {

        describe('create new typing game challenge', function () {

            let updated_list;

            let original_length;
            let new_length;

            it('submitting form should not change current page address', function () {

                return loadGame(0).then(y => {

                    let old_href = document.querySelector("iframe").contentWindow.location.href;

                    y.querySelector("a[href='/games/typing/challenges']").click();

                    return wait(200).then(() => {

                        original_length = y.querySelectorAll(".list .challenge").length;

                        y.querySelector("form[action='/games/typing/challenges'][method='post'] input[name='text']").value = text;
                        y.querySelector("form[action='/games/typing/challenges'][method='post'] input[name='author']").value = author;
                        y.querySelector("form[action='/games/typing/challenges'][method='post'] input[name='level']").value = level;

                        y.querySelector("form[action='/games/typing/challenges'][method='post'] input[type='submit']").click();

                        return wait(200).then(() => {

                            should(document.querySelector("iframe").contentWindow.location.href).be.equal(old_href);

                            updated_list = y.querySelector(".list").innerHTML;

                            new_length = y.querySelectorAll(".list .challenge").length;

                        });

                    });

                });

            });

            it('list should display newly created item', function () {

                should(updated_list.indexOf(text) >= 0).be.equal(true);
                should(updated_list.indexOf(author) >= 0).be.equal(true);

            });

            it('list content should be longer', function () {

                should(new_length - 1).be.equal(original_length);

            });

        });

    });

    describe('Task 8', function () {

        describe('Edit Challenge', function () {

            let edit_links;

            let edit_form;

            let original_length;

            it('Listed challenges should include edit link', function () {

                return loadGame(0).then(y => {

                    y.querySelector("a[href='/games/typing/challenges']").click();

                    return wait(200).then(() => {

                        original_length = y.querySelectorAll(".list .challenge").length;

                        edit_form = y.querySelector("form[action='/games/typing/challenges'][method='post']");

                        return api.getChallenges();

                    }).then(a => {

                        edit_links = a.map(c => {

                            should.exist(y.querySelector(`a[href$='/${c._id}/edit']`));

                            return { c, link: y.querySelector(`a[href$='/${c._id}/edit']`) };

                        });

                        should(edit_links.length).be.equal(original_length);

                    });

                });

            });

            it('Clicking on edit link should display content inside form', function () {

                return check(0);

                function check(i) {

                    let old_href = document.querySelector("iframe").contentWindow.location.href;

                    let o = edit_links[i];

                    o.link.click();

                    //give the click a chance to do its thing
                    return wait(25).then(() => {

                        should(old_href).be.equal(document.querySelector("iframe").contentWindow.location.href);

                        should(edit_form.querySelector("input[name='text']").value).be.equal(o.c.text);
                        should(edit_form.querySelector("input[name='author']").value).be.equal(o.c.author);
                        should(edit_form.querySelector("input[name='level']").value).be.equal(o.c.level);

                        if (i == edit_links.length - 1) {
                            return;
                        } else {
                            return check(i + 1);
                        }
                    });

                }

            });

            it('Clicking on update button should save the form content', function () {

                let o = edit_links[Math.floor(Math.random() * edit_links.length)];

                o.link.click();

                return wait(20).then(() => {

                    should(edit_form.querySelector("input[name='text']").value).be.equal(o.c.text);
                    should(edit_form.querySelector("input[name='author']").value).be.equal(o.c.author);
                    should(edit_form.querySelector("input[name='level']").value).be.equal(o.c.level);

                    let old_text = edit_form.querySelector("input[name='text']").value;
                    let old_author = edit_form.querySelector("input[name='author']").value;
                    let old_level = edit_form.querySelector("input[name='level']").value;

                    edit_form.querySelector("input[name='text']").value += randomText(3);
                    edit_form.querySelector("input[name='author']").value += randomText(3);
                    edit_form.querySelector("input[name='level']").value = Math.round(Math.random() * 10);

                    let new_text = edit_form.querySelector("input[name='text']").value;
                    let new_author = edit_form.querySelector("input[name='author']").value;
                    let new_level = edit_form.querySelector("input[name='level']").value;

                    let old_href = document.querySelector("iframe").contentWindow.location.href;

                    edit_form.querySelector("input[type='submit']").click();

                    return wait(10).then(() => {

                        should(old_href).be.equal(document.querySelector("iframe").contentWindow.location.href);

                        return api.getChallenges();

                    }).then((a) => {

                        should(original_length).be.equal(a.length);

                        let c = a.find(c => c._id == o.c._id);

                        should(c.text).be.equal(new_text);
                        should(c.author).be.equal(new_author);
                        should(c.level).be.equal(new_level);

                        should(c.text).not.be.equal(old_text);
                        should(c.author).not.be.equal(old_author);
                        should(c.level).not.be.equal(old_level);

                    });

                });

            });

        });

    });

    describe('Task 9', function () {

        let delete_forms;

        describe('Delete Challenge', function () {

            it('every listed challenge should have a delete form', function () {

                return loadGame(0).then(y => {

                    y.querySelector("a[href='/games/typing/challenges']").click();

                    return wait(200).then(() => {

                        return api.getChallenges();

                    }).then(a => {

                        delete_forms = a.map(c => {

                            let form = y.querySelector(`form[action$='/${c._id}?_method=delete' i][method="POST"]`);

                            should.exist(form);

                            return { c, form};

                        });

                    });

                });

            });

            it('clicking on the delete form submit should remove the corresponding challenge', function () {

                delete_forms[0].form.querySelector("input[type='submit']").click();

                return wait(100).then(()=>{

                    return api.getChallenges();

                }).then((a)=>{

                    should(a.length).be.equal(delete_forms.length - 1);

                    should(0).be.equal(a.filter(o=>o._id == delete_forms[0].c._id).length);

                })

            });

        });

    });


    describe('Task 10', function () {

        describe('GET /games/typing/challenges/random', function () {

            it('should return a randomly chosen challenge object', function () {

                return Promise.all([api.getRandomChallenge(), api.getRandomChallenge(), api.getRandomChallenge()]).then(a=>{

                    a.forEach(c=>{

                        should.exist(c);
                        should.exist(c.text);
                        should.exist(c.author);
                        should.exist(c.level);
                        should.exist(c._id);

                    });

                    if (a[0]._id != a[1]._id) {
                        should(a[0]).not.be.deepEqual(a[1]);
                    }
                    if (a[0]._id != a[2]._id) {
                        should(a[0]).not.be.deepEqual(a[1]);
                    }

                })

            });

        });

    });