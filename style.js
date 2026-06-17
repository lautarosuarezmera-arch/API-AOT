/* ==========================================================================
   BLOQUE 1: CONTROL DEL MENÚ Y SOLICITUDES API AJAX
   ========================================================================== */

// Realiza las peticiones asíncronas HTTP a la API según la categoría seleccionada
function xhttpRequest(e) {
    let pedido = e.target.name; 
    let respuesta = document.querySelector("#resultado");
    let homeSection = document.querySelector(".home"); 
    let loading = document.querySelector("#loading");
    let zonaJuego = document.querySelector("#zona-juego");
    
    let url = "https://api.attackontitanapi.com/" + pedido;

    // Manejo de visibilidad de interfaces al cambiar de sección
    if (zonaJuego) zonaJuego.style.display = "none";
    if (homeSection) homeSection.style.display = "none";
    if (loading) loading.style.display = "block";
    if (respuesta) {
        respuesta.innerHTML = ""; 
        respuesta.style.display = "none";
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (loading) loading.style.display = "none";

            if (this.status == 200) {
                let response = JSON.parse(this.responseText);
                let html = ""; 

                if (respuesta) respuesta.style.display = "grid";

                // Renderizado dinámico de tarjetas
                response.results.forEach(elemento => {
                    let elementoString = btoa(unescape(encodeURIComponent(JSON.stringify(elemento))));
                    let titulo = elemento.name || elemento.episode || "Registro Desconocido";

                    html += `
                        <div class="tarjeta" onclick="abrirModal('${elementoString}')" style="cursor:pointer;">
                            <h3>${titulo}</h3>
                            ${elemento.img ? `<img src="${elemento.img}" alt="${titulo}">` : '<div class="no-img">⚔️</div>'}
                        </div>
                    `;
                });
                respuesta.innerHTML = html;
            } else {
                console.error("Error al conectar con los servidores de los muros: Status " + this.status);
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

/* ==========================================================================
   BLOQUE 2: LÓGICA DE DETALLES (VENTANA MODAL)
   ========================================================================== */

// Decodifica la información del elemento y abre la ventana informativa modal
function abrirModal(elementoCodificado) {
    let elemento = JSON.parse(decodeURIComponent(escape(atob(elementoCodificado))));
    const modal = document.getElementById('miModal');
    const modalBody = document.getElementById('modal-body');

    let titulo = elemento.name || elemento.episode || "Información Oculta";

    // Validador interno para campos nulos o vacíos
    function limpiarDato(valor) {
        if (!valor || valor.toString().trim() === "" || valor.toString().toLowerCase() === "unknown") {
            return '<span style="color: #666; font-style: italic;">No registra</span>';
        }
        return valor;
    }

    let detallesHtml = `
        <h2 style="margin-bottom:15px; color:#fff; border-bottom:1px solid #333; padding-bottom:10px;">${titulo}</h2>
        ${elemento.img ? `<img src="${elemento.img}" alt="${titulo}" style="max-width:100%; max-height:260px; border-radius:4px; margin-bottom:15px; object-fit: cover; border:1px solid #333;">` : ''}
        <div style="text-align: left; line-height: 1.6; font-size:15px; color:#ccc;">
    `;

    // Inyección condicional de datos según propiedades del elemento
    detallesHtml += `<p><strong>Género:</strong> ${limpiarDato(elemento.gender)}</p>`;
    detallesHtml += `<p><strong>Estado:</strong> ${limpiarDato(elemento.status)}</p>`;
    detallesHtml += `<p><strong>Ocupación:</strong> ${limpiarDato(elemento.occupation)}</p>`;
    detallesHtml += `<p><strong>Alias:</strong> ${limpiarDato(elemento.alias)}</p>`;
    
    if (elemento.height || elemento.current_inheritor || elemento.abilities) {
        detallesHtml += `<p><strong>Altura/Clase:</strong> ${limpiarDato(elemento.height)}</p>`;
        detallesHtml += `<p><strong>Portador actual:</strong> ${limpiarDato(elemento.current_inheritor)}</p>`;
        
        let habilidades = elemento.abilities;
        if (Array.isArray(habilidades)) {
            habilidades = habilidades.length > 0 ? habilidades.join(', ') : "unknown";
        }
        detallesHtml += `<p><strong>Habilidades:</strong> ${limpiarDato(habilidades)}</p>`;
    }

    if (elemento.released || elemento.description || elemento.leader) {
        detallesHtml += `<p><strong>Lanzamiento:</strong> ${limpiarDato(elemento.released)}</p>`;
        detallesHtml += `<p><strong>Descripción:</strong> ${limpiarDato(elemento.description)}</p>`;
        detallesHtml += `<p><strong>Líder:</strong> ${limpiarDato(elemento.leader)}</p>`;
    }

    detallesHtml += `</div>`;
    modalBody.innerHTML = detallesHtml;
    modal.classList.add('activo');
}

/* ==========================================================================
   BLOQUE 3: EVENTOS INTERNOS Y NAVEGACIÓN
   ========================================================================== */

// Restablece la app limpiando resultados y volviendo al estado de inicio (Home)
function ereh() {
    let respuesta = document.querySelector("#resultado");
    let homeSection = document.querySelector(".home");
    let zonaJuego = document.querySelector("#zona-juego");

    if (zonaJuego) zonaJuego.style.display = "none";
    resetearVariablesJuego();

    if (respuesta) {
        respuesta.innerHTML = "";
        respuesta.style.display = "none"; 
    }
    if (homeSection) homeSection.style.display = "flex"; 
}

const botonSubir = document.querySelector('#btnVolverArriba');

// Escucha el scroll de la ventana para mostrar/ocultar el botón flotante
window.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop > 300 || window.pageYOffset > 300) {
        if (botonSubir) botonSubir.style.display = "block";
    } else {
        if (botonSubir) botonSubir.style.display = "none";
    }
});

function subirAlInicio() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cerrarModal() {
    const modal = document.getElementById('miModal');
    if (modal) modal.classList.remove('activo');
}

// Cierra el modal de forma intuitiva si el usuario hace clic fuera de la caja
window.addEventListener('click', (e) => {
    const modal = document.getElementById('miModal');
    if (e.target === modal) cerrarModal();
});

/* ==========================================================================
   BLOQUE 4: SISTEMA DE MINIJUEGO POR RONDAS CORTEAS (5 PREGUNTAS)
   ========================================================================== */

let puntaje = 0;
let rondaActual = 0;
let listaPersonajesGlobal = [];      // Bolsa inmutable con todos los personajes descargados
let personajesDisponiblesRonda = []; // Bolsa dinámica que se vacía para evitar repeticiones
let personajeCorrecto = null;

// Inicializa o resetea contadores globales de partida
function resetearVariablesJuego() {
    puntaje = 0;
    rondaActual = 0;
    personajesDisponiblesRonda = [...listaPersonajesGlobal]; 
    let marcador = document.getElementById("marcador-puntos");
    if (marcador) marcador.innerText = "PUNTOS: 0";
}

// Controla el inicio del minijuego descargando datos si no existen previamente
function iniciarMinijuego() {
    let respuesta = document.querySelector("#resultado");
    let homeSection = document.querySelector(".home");
    let loading = document.querySelector("#loading");
    let zonaJuego = document.querySelector("#zona-juego");

    if (homeSection) homeSection.style.display = "none";
    if (respuesta) { respuesta.innerHTML = ""; respuesta.style.display = "none"; }
    if (loading) loading.style.display = "block";
    if (zonaJuego) zonaJuego.style.display = "none";

    // Si la info ya está en memoria, evita volver a llamar al servidor
    if (listaPersonajesGlobal.length > 0) {
        if (loading) loading.style.display = "none";
        if (zonaJuego) zonaJuego.style.display = "flex";
        resetearVariablesJuego();
        cargarNuevaPregunta();
        return;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (loading) loading.style.display = "none";
            if (this.status == 200) {
                let response = JSON.parse(this.responseText);
                listaPersonajesGlobal = response.results.filter(p => p.img && p.name);
                
                if (zonaJuego) zonaJuego.style.display = "flex";
                personajesDisponiblesRonda = [...listaPersonajesGlobal]; 
                resetearVariablesJuego();
                cargarNuevaPregunta();
            } else {
                alert("Error al conectar los servidores tácticos para el entrenamiento.");
            }
        }
    };
    xhttp.open("GET", "https://api.attackontitanapi.com/characters", true);
    xhttp.send();
}

// Prepara y dibuja la interfaz para una nueva pregunta de reconocimiento
function cargarNuevaPregunta() {
    if (rondaActual >= 5) {
        finalizarPartida();
        return;
    }

    if (personajesDisponiblesRonda.length < 1 || listaPersonajesGlobal.length < 4) {
        resetearVariablesJuego();
    }

    rondaActual++;

    const imgElement = document.getElementById("juego-img");
    const pistaElement = document.getElementById("juego-pista");
    const opcionesContainer = document.getElementById("juego-opciones");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const tagMision = document.querySelector(".tag-status");

    if (tagMision) tagMision.innerText = `MISIÓN: ARCHIVO ${rondaActual} / 5`;
    
    imgElement.style.filter = "blur(15px)"; 
    pistaElement.innerText = "¿Quién es este soldado de Paradis/Marley?";
    pistaElement.style.color = "#858585";
    btnSiguiente.style.display = "none";
    btnSiguiente.innerText = rondaActual === 5 ? "Ver Evaluación Táctica ➔" : "Siguiente Archivo ➔";
    opcionesContainer.innerHTML = "";

    // Selección aleatoria quitándolo de la bolsa para que no se repita
    let indexCorrecto = Math.floor(Math.random() * personajesDisponiblesRonda.length);
    personajeCorrecto = personajesDisponiblesRonda.splice(indexCorrecto, 1)[0]; 

    imgElement.src = personajeCorrecto.img;

    // Obtención de los 3 "impostores" incorrectos
    let impostoresDisponibles = listaPersonajesGlobal.filter(p => p.name !== personajeCorrecto.name);
    let seleccionados = [personajeCorrecto];

    for (let i = 0; i < 3; i++) {
        let indexImpostor = Math.floor(Math.random() * impostoresDisponibles.length);
        seleccionados.push(impostoresDisponibles.splice(indexImpostor, 1)[0]);
    }

    // Algoritmo simple de mezclado aleatorio
    seleccionados.sort(() => Math.random() - 0.5);

    // Creación dinámica de botones de opciones
    seleccionados.forEach(p => {
        let btn = document.createElement("button");
        btn.classList.add("btn-opcion");
        btn.innerText = p.name;
        btn.onclick = function() { verificarRespuesta(p.name, btn); };
        opcionesContainer.appendChild(btn);
    });
}

// Evalúa la opción presionada por el jugador, altera puntajes y aplica clases CSS de acierto/error
function verificarRespuesta(nombreSeleccionado, botonPresionado) {
    const opcionesBotones = document.querySelectorAll(".btn-opcion");
    const imgElement = document.getElementById("juego-img");
    const pistaElement = document.getElementById("juego-pista");
    const marcador = document.getElementById("marcador-puntos");
    const btnSiguiente = document.getElementById("btn-siguiente");

    imgElement.style.filter = "blur(0px)";

    opcionesBotones.forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === personajeCorrecto.name) {
            btn.classList.add("opcion-correcta");
        }
    });

    if (nombreSeleccionado === personajeCorrecto.name) {
        puntaje += 10;
        botonPresionado.classList.add("opcion-correcta");
        pistaElement.innerText = "¡RECONOCIMIENTO EXITOSO! Sumas +10 puntos.";
        pistaElement.style.color = "#8be9fd";
    } else {
        botonPresionado.classList.add("opcion-incorrecta");
        pistaElement.innerText = `FALLASTE. Se trataba de: ${personajeCorrecto.name}`;
        pistaElement.style.color = "#ff5555";
    }

    if (marcador) marcador.innerText = `PUNTOS: ${puntaje}`;
    if (btnSiguiente) btnSiguiente.style.display = "block";
}

// Finaliza el juego tras 5 rondas desplegando el rango final obtenido
function finalizarPartida() {
    const pistaElement = document.getElementById("juego-pista");
    const opcionesContainer = document.getElementById("juego-opciones");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const tagMision = document.querySelector(".tag-status");

    if (tagMision) tagMision.innerText = "ENTRENAMIENTO FINALIZADO";
    btnSiguiente.style.display = "none";
    opcionesContainer.innerHTML = "";

    let rangoMilitar = "CADETE DESHONRADO";
    let mensajeMilitar = "Necesitás volver a repasar urgentemente los registros de los muros.";

    if (puntaje === 50) {
        rangoMilitar = "CAPITÁN DE ESCUADRÓN (LEVI STATUS)";
        mensajeMilitar = "¡Impresionante! Tu capacidad de reconocimiento visual está al nivel de los mejores guerreros de la humanidad.";
    } else if (puntaje >= 30) {
        rangoMilitar = "SOLDADO EXPERTO";
        mensajeMilitar = "Buen trabajo en el campo. Identificaste a la mayoría de los objetivos asignados.";
    }

    pistaElement.innerHTML = `
        <div style="margin-top:15px; padding:15px; border:1px solid #8c763d; background: rgba(0,0,0,0.5); border-radius:4px;">
            <h3 style="color:#e5c158; font-family:'Cinzel', serif; margin-bottom:10px;">${rangoMilitar}</h3>
            <p style="color:#ccc; font-size:14px; text-transform:none; letter-spacing:0; line-height:1.5;">${mensajeMilitar}</p>
            <h2 style="color:#fff; margin-top:15px; font-size:24px;">PUNTUACIÓN: ${puntaje} / 50</h2>
        </div>
        <button onclick="resetearVariablesJuego(); cargarNuevaPregunta();" class="tag-status" style="margin-top:25px; background-color:#3a5311; color:white; border:1px solid #2d400e; padding:12px 25px; cursor:pointer; font-family:'Cinzel', serif; font-size:13px; letter-spacing:1px; width:100%; text-transform:uppercase;">Iniciar Nueva Misión ⚔️</button>
    `;
}