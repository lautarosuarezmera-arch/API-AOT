/* BANNER - EFECTO SCROLL */
let ultimoScroll = 0; 
const banner = document.querySelector('.banner');

window.addEventListener('scroll', () => {
    const scrollActual = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollActual > ultimoScroll && scrollActual > 100) {
        banner.classList.add('oculto');
    } else {
        banner.classList.remove('oculto');
    }
    ultimoScroll = scrollActual <= 0 ? 0 : scrollActual; 
});


/* API AOT UNIFICADA */
function xhttpRequest(e){
    let pedido = e.target.name; 
    let respuesta = document.querySelector("#resultado");
    let homeSection = document.querySelector(".home"); 
    let url = "https://api.attackontitanapi.com/" + pedido;

    // Ocultamos la sección de bienvenida
    if (homeSection) {
        homeSection.style.display = "none";
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            console.dir(response);
            
            let html = ""; // Declarada justo donde se necesita

            response.results.forEach(elemento => {
                html += `
                    <div class="tarjeta">
                        <h3>${elemento.name}</h3>
                        ${elemento.img ? `<img src="${elemento.img}" alt="${elemento.name}">` : ''}
                    </div>
                `;
            });
            respuesta.innerHTML = html;
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}


/* BOTÓN DE INICIO */
function ereh(){
    let respuesta = document.querySelector("#resultado");
    let homeSection = document.querySelector(".home");

    // Borramos los datos cargados de la API
    if (respuesta) {
        respuesta.innerHTML = "";
    }

    // Mostramos la sección .home original quitando el display customizado
    if (homeSection) {
        homeSection.style.removeProperty('display');
    }
}

/* LÓGICA DEL BOTÓN "VOLVER ARRIBA"*/
const botonSubir = document.querySelector('#btnVolverArriba');

// Detectamos el movimiento del scroll para ocultar o mostrar el botón
window.addEventListener('scroll', () => {
    // Si el usuario baja más de 300 píxeles, el botón aparece; si sube al inicio, se oculta
    if (document.documentElement.scrollTop > 300 || window.pageYOffset > 300) {
        botonSubir.style.display = "block";
    } else {
        botonSubir.style.display = "none";
    }
});

// Esta función es la que llama tu HTML con el onclick="subirAlInicio()"
function subirAlInicio() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Hace que suba deslizándose suavemente
    });
}