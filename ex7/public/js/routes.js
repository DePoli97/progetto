/**
 * Web Atelier 2022  - 7 - Single-Page Web Applications with Fetch and Client-side Views
 *
 * Author: __Student_Name__
 *
 * Client-side routes
 *
 *
 */

function refresh_high_scores() {

    api.get_high_scores().then((hs)=>{
        let html = ejs.views_includes_high_scores({high_scores:hs});
        document.getElementById("high_scores").innerHTML = html;
    });

}

function init() {

    refresh_high_scores();


    document.querySelectorAll("a").forEach(link=>{
        link.addEventListener("click", (e)=>{
            e.preventDefault();

            let url = new URL(e.currentTarget.href);

            //TODO call the client-side router based on the link target href

        });
    })


} //init