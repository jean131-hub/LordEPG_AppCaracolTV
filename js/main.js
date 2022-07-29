// LaKalle event_seq=01 al 99
// HD event_seq=100 al 999
// HD2 event_seq=1000 al 9999

/*-----------------------Things to do------------------
    -Colocar valores nibbles lista multiple
    -Remover formato fecha antes de generar XML
    -Crear Boton Limpiar formulario, generar EPG
    -
*/


/*-----------------------Mejoras LordEPG v1.0------------------
    -Añade 5 horas al reloj
    -
    -
    -
*/

/*-----------------------KPI EMISION CRC----------------------*/

//Variables formulario
const inputEvento = document.querySelector('#evento');
const inputSinopsis = document.querySelector('#sinopsis');
const inputTipoPgm = document.querySelector('#tipo');
const inputFechaI = document.querySelector('#fecha_in');
const inputFechaO = document.querySelector('#fecha_out');
const inputHoraI = document.querySelector('#tiempo_in');
const inputHoraO = document.querySelector('#tiempo_out');

const formulario = document.querySelector('#nuevo-evento');
const inputSelect = document.querySelector('#tipo');

const eventoWrap = document.querySelector('#eventos');

//Eventos sobre el DOM
cargarEventListeners();

//Editar
let editar = false;

//Objeto Eventos EPG
eventoObj = {
    evento: '',
    sinopsis: '',
    nibble1: '',
    nibble2: '',
    fecha_in: '',
    fecha_out: '',
    tiempo_in: '',
    tiempo_out: '',
};


//Clases
class UI {

    imprimirAlerta(mensaje, tipo) {


        const divAlerta = document.createElement('div');

        if (tipo === 'error') {
            divAlerta.classList.add('alert', 'alert-danger', 'text-center', 'mt-2', 'alerta', 'w-50');
            divAlerta.textContent = mensaje;
        } else {
            divAlerta.classList.add('alert', 'alert-success', 'text-center', 'mt-2', 'alerta', 'w-50');
            divAlerta.textContent = mensaje;
        };

        document.querySelector('.row').insertBefore(divAlerta,
            document.querySelector('.content'));

        setTimeout(() => {
            divAlerta.remove();
        }, 2000);

    };

    mostrarHtml({ eventos }) {

        this.limpiarHtml();

        eventos.forEach(eventoObj => {

            const { evento, sinopsis, nibble1, nibble2, fecha_in, fecha_out, tiempo_in, tiempo_out, id } = eventoObj;

            const divEvento = document.createElement('div');
            divEvento.classList.add('evento', 'p-3');

            const eventoTitulo = document.createElement('h2');
            eventoTitulo.textContent = evento;
            eventoTitulo.classList.add('card-title', 'font-weight-bolder');

            const sinopsisParrafo = document.createElement('p');
            sinopsisParrafo.innerHTML = `
                <span class='fw-bolder'>Sinopsis: </span>${sinopsis}
            `
            // const nibble1Parrafo = document.createElement('p');
            // nibble1Parrafo.innerHTML = `
            //     <span>Nibble1: </span>${nibble1}
            // `
            // const nibble2Parrafo = document.createElement('p');
            // nibble2Parrafo.innerHTML = `
            //     <span>Nibble2: </span>${nibble2}
            // `
            const fecha_inParrafo = document.createElement('p');
            fecha_inParrafo.innerHTML = `
                <span class='fw-bolder'>Fecha Inicio: </span>${fecha_in}
            `
            const fecha_outParrafo = document.createElement('p');
            fecha_outParrafo.innerHTML = `
                <span class='fw-bolder'>Fecha Fin: </span>${fecha_out}
            `
            const tiempo_inParrafo = document.createElement('p');
            tiempo_inParrafo.innerHTML = `
                <span class='fw-bolder'>Hora Entrada: </span>${tiempo_in}
            `
            const tiempo_outParrafo = document.createElement('p');
            tiempo_outParrafo.classList.add('mb-2');
            tiempo_outParrafo.innerHTML = `
                <span class='fw-bolder''>Hora Salida: </span>${tiempo_out}
            `
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-primary');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>`;
            btnEditar.onclick = (e) => {
                editarEvento(eventoObj);
            };

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'ms-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>`;
            btnEliminar.onclick = (e) => {
                adminEventos.eliminarEvento(id);
                ui.mostrarHtml(adminEventos);
                ui.imprimirAlerta(`Se ha eliminado evento: ${evento}`, 'success');
            };



            divEvento.appendChild(eventoTitulo);
            divEvento.appendChild(sinopsisParrafo);
            // divEventos.appendChild(nibble1Parrafo);
            // divEventos.appendChild(nibble2Parrafo);
            divEvento.appendChild(fecha_inParrafo);
            divEvento.appendChild(fecha_outParrafo);
            divEvento.appendChild(tiempo_inParrafo);
            divEvento.appendChild(tiempo_outParrafo);
            divEvento.appendChild(btnEditar);
            divEvento.appendChild(btnEliminar);

            eventoWrap.appendChild(divEvento);
        });
    };

    limpiarHtml() {

        while (eventoWrap.contains(eventoWrap.firstChild)) {
            console.log(eventoWrap.firstChild)
            eventoWrap.removeChild(eventoWrap.firstChild);
        };
    };

};

class Eventos {

    constructor() {

        this.eventos = [];

    };

    agregarEvento(nuevoEvento) {
        this.eventos = [...this.eventos, nuevoEvento];
    };

    eliminarEvento(idEvento) {
        this.eventos = this.eventos.filter((evento) => idEvento !== evento.id);
    };

    editarEvento(eventoEditado) {
        this.eventos = this.eventos.map((evento) => evento.id === eventoEditado.id ? eventoEditado : evento);
    };

};


//Instancias Obj
const ui = new UI();
const adminEventos = new Eventos();


//Funciones
function cargarEventListeners() {
    inputEvento.addEventListener('change', cargarDatos);
    inputSinopsis.addEventListener('change', cargarDatos);
    inputTipoPgm.addEventListener('change', (e) => {
        //Carga Nibble1
        cargarDatos(e);
        //Carga Nibble2
        eventoObj['nibble2'] = inputSelect.selectedOptions[0].getAttribute("data-value2");
    });
    inputFechaI.addEventListener('change', cargarDatos);
    inputFechaO.addEventListener('change', cargarDatos);
    inputHoraI.addEventListener('change', ajustarHora);
    inputHoraO.addEventListener('change', ajustarHora);

    formulario.addEventListener('submit', validarFormulario);
};

function cargarDatos(e) {
    /*
      Carga cada uno de los datos del formulario
      en el objeto eventoObj

      Argumentos:
          Evento
      
      TO DO:
          *Solucionar carga del nibble2
          inputTipoPgm.
          *Corregir item vacío cuando cargamos el tipo de pgm
  */

    // console.log(e.target.value);
    // console.log(inputSelect.selectedOptions[0].getAttribute("data-value2"));

    eventoObj[e.target.name] = e.target.value;
};

function removerFormato(e) {
    /*
        La función remueve los guiones(-) colocados
        a las fechas por defecto.

        Argumentos:
            Evento(e)
        
        TO DO:
            *
    */

    let fecha;

    fecha = e.target.value;
    fecha = fecha.replace(/-/g, '');

    eventoObj[e.target.name] = fecha;

    return fecha;
};

function ajustarHora(e) {

    /*
            Ajusta +5h con librería moment.js
            para el Barrow genere la EPG en 
            horario Colombia

            Argumentos:
                Evento(e)
        
            TO DO:
                *Probar como argumento de cargar Datos (NO WORK)
    */

    let tiempo, hora, minutos;

    //Divido tiempo en horas y minutos
    tiempo = e.target.value.split(':');

    hora = parseInt(tiempo[0]);
    minutos = parseInt(tiempo[1]);

    //Sobreescribe tiempo a Date
    //Date(year, month, day, HH,mm, ss, ms )
    tiempo = new Date(2022, 0, 1, hora, minutos, 0, 0);

    //Sumo 5 horas al tiempo inicial
    tiempo = moment(tiempo).add(5, 'hours').format('HH:mm:ss');

    eventoObj[e.target.name] = tiempo;

    // console.log(tiempo);

    return tiempo;
};

function validarFormulario(e) {

    e.preventDefault();
    const { evento, sinopsis, nibble1, nibble2, fecha_in, fecha_out, tiempo_in, tiempo_out } = eventoObj;

    if (evento === '' || sinopsis === '' || nibble1 === '' || nibble2 === '' ||
        fecha_in === '' || fecha_out === '' || tiempo_in === '' || tiempo_out === '') {

        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        // console.log('Todos los campos son obligatorios');

        return;
    };

    if (editar) {
        adminEventos.editarEvento(eventoObj);
        console.log(eventoObj);
        ui.imprimirAlerta('Cambios Guardados', 'success');
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Evento';
        editar = false;
    } else {
        //Asignamos ID al evento
        eventoObj.id = Date.now();

        adminEventos.agregarEvento(eventoObj);
        ui.imprimirAlerta('Nuevo evento creado', 'success');

    };

    ui.mostrarHtml(adminEventos);
    limpiarObj();
    formulario.reset();
};

function limpiarObj() {

    eventoObj = {
        evento: '',
        sinopsis: '',
        nibble1: '',
        nibble2: '',
        fecha_in: '',
        fecha_out: '',
        tiempo_in: '',
        tiempo_out: ''
    };

};

function editarEvento(eventoEditar) {

    editar = true;

    const { evento, sinopsis, nibble1, nibble2, fecha_in, fecha_out, tiempo_in, tiempo_out, id } = eventoEditar;
    //Cargar Datos Objeto
    inputEvento.value = evento;
    inputSinopsis.value = sinopsis;
    inputTipoPgm.value = nibble1;
    inputFechaI.value = fecha_in;
    inputFechaO.value = fecha_out;
    inputHoraI.value = tiempo_in;
    inputHoraO.value = tiempo_out;

    //llenar Objeto
    eventoObj.evento = evento;
    eventoObj.sinopsis = sinopsis;
    eventoObj.nibble1 = nibble1;
    eventoObj.nibble2 = nibble2;
    eventoObj.fecha_in = fecha_in;
    eventoObj.fecha_out = fecha_out;
    eventoObj.tiempo_in = tiempo_in;
    eventoObj.tiempo_out = tiempo_out;
    eventoObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
};