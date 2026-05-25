function xhttpRequest(){
    let respuesta = document.querySelector("#resultado");
    let html = "";
    let url = "https://api.attackontitanapi.com/titans";

/* TODAS LAS POSIBLES INFORMACION SOBRE:
    "characters": "https://api.attackontitanapi.com/characters",
    "episodes": "https://api./attackontitanapi.com/episodes",
    "locations": "https://api.attackontitanapi.com/locations",
    "organizations": "https://api.attackontitanapi.com/organizations",
    "titans": "https://api.attackontitanapi.com/titans"
*/

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200)
        {
            let response = JSON.parse(this.responseText);
            console.dir(response);

            response.results.forEach(personaje => 
                {
                html += `<p>${personaje.name}</p>
                            <img src="${personaje.img}" alt="${personaje.name}">`
                });
            respuesta.innerHTML = html;
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}