const d = document,
    resultado = d.querySelector('#resultado'),
    formulario = d.querySelector('#formulario'),
    paginacionDiv = d.querySelector('#paginacion'),
    registrosPorPagina = 40;
let totalPaginas,
    iterador,
    paginaActual = 1;

window.onload = () => formulario.addEventListener('submit', validarFormulario)

function validarFormulario(e) {
    e.preventDefault()
    const termino = d.querySelector('#termino').value

    if (termino === '') {
        mostrarAlerta('Agregar el tipo de categoría que desees busar...')
    }
    buscarImagenes(termino)
}

function mostrarAlerta(mensaje) {
    const existeAlerta = d.querySelector('.alerta')
    if (!existeAlerta) {
        const alerta = d.createElement('p')
        alerta.textContent= mensaje
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','mt-5','rounded','max-w-lg','mx-auto','text-center','alerta')
        formulario.appendChild(alerta)
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

async function buscarImagenes() {

    const termino = d.querySelector('#termino').value
    const keyApi = '29980209-952b65cb29df0be1d534f22c6'
    const url = `https://pixabay.com/api/?key=${keyApi}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`
    /* fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPagina(resultado.totalHits)
            mostrarImagenes(resultado.hits)
        }) */

        try {
            const respuesta = await fetch(url)
            const resultado = await respuesta.json()
            totalPaginas = calcularPagina(resultado.totalHits)
            mostrarImagenes(resultado.hits)
        } catch (error) {
            console.log(error);
        }
}
function calcularPagina(total) {
    return parseInt(Math.ceil(total /registrosPorPagina))
}
//Generador de paginas
function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i
    }
}

function mostrarImagenes(imagenes) {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
    imagenes.forEach(data =>{
        const {previewURL, id, views,likes, largeImageURL} = data
        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}"/>
                <div class="p-4">
                    <p class="font-bold">${likes} <span class="font-light">Me gusta</span></p>
                    <p class="font-bold">${views} <span class="font-light">Veces visto</span></p>
                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" target="_blank" rel="noopener noreferrer" href="${largeImageURL}">
                        Ver Imágen
                    </a>
                </div>
            </div>
        </div>
        `
    })
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }
    imprimirPaginador()
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas)
    while(true){
        const { value, done } = iterador.next()
        if (done) return
        const boton = d.createElement('a')
        boton.href = '#'
        boton.dataset.pagina = value
        boton.textContent = value
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-2','rounded')
        boton.onclick = () =>{
            paginaActual = value
            buscarImagenes()
        }
        paginacionDiv.appendChild(boton)
    }
}