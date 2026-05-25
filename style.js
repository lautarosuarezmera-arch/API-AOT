/* BANNER */
let ultimoScroll = 0; /* FUNCION PARA QUE EL BANNER SUBA Y BAJE*/
const banner = document.querySelector('.banner');

window.addEventListener('scroll', () => {
    const scrollActual = window.pageYOffset || document.documentElement.scrollTop;

    // Si el usuario baja, esconde el banner. Si sube, lo muestra.
    if (scrollActual > ultimoScroll && scrollActual > 100) {
        banner.classList.add('oculto');
    } else {
        banner.classList.remove('oculto');
    }

    ultimoScroll = scrollActual <= 0 ? 0 : scrollActual; 
});

/* API AOT*/
function xhttpRequest(){
    let respuesta = document.querySelector("#resultado");
    let html = "";
    let url = "https://api.attackontitanapi.com/characters";

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            console.dir(response);

            response.results.forEach(personaje => {
                html += `
                    <p>${personaje.name}</p>
                    <img src="${personaje.img}" alt="${personaje.name}">
                `;
            });
            respuesta.innerHTML = html;
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function xhttpRequest2(){
    let respuesta = document.querySelector("#resultado");
    let html = "";
    let url = "https://api.attackontitanapi.com/titans";

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            console.dir(response);

            response.results.forEach(personaje => {
                html += `
                    <p>${personaje.name}</p>
                    <img src="${personaje.img}" alt="${personaje.name}">
                `;
            });
            respuesta.innerHTML = html;
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function xhttpRequest3(){
    let respuesta = document.querySelector("#resultado");
    let html = "";
    let url = "https://api.attackontitanapi.com/locations";

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            console.dir(response);

            response.results.forEach(personaje => {
                html += `
                    <p>${personaje.name}</p>
                    <img src="${personaje.img}" alt="${personaje.name}">
                `;
            });
            respuesta.innerHTML = html;
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function xhttpRequest4(){
    let respuesta = document.querySelector("#resultado");
    let html = "";
    let url = "https://api.attackontitanapi.com/episodes";

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            console.dir(response);

            response.results.forEach(personaje => {
                html += `
                    <p>${personaje.name}</p>
                    <img src="${personaje.img}" alt="${personaje.name}">
                `;
            });
            respuesta.innerHTML = html;
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function xhttpRequest5(){
    let respuesta = document.querySelector("#resultado");
    let html = "";
    let url = "https://api.attackontitanapi.com/organizations";

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            console.dir(response);

            response.results.forEach(personaje => {
                html += `
                    <p>${personaje.name}</p>
                    <img src="${personaje.img}" alt="${personaje.name}">
                `;
            });
            respuesta.innerHTML = html;
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}