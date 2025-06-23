// Autores: Guzmán Da Silveira y Felipe Martínez

const sistema = new Sistema();

// Referencias a botones
document.getElementById("idBotonDatos").addEventListener("click", opcionDatos);
document.getElementById("idBotonEstad").addEventListener("click", opcionEstadisticas);
document.getElementById("idBotonAddCarr").addEventListener("click", agregarCarrera);
document.getElementById("idBotonAgregarActualizar").addEventListener("click", agregarActualizarPatrocinador);
document.getElementById("idBotonAgregarCorredor").addEventListener("click", agregarCorredor);
document.getElementById("idBotonInscribir").addEventListener("click", inscribirCorredor);


// Funciones

function opcionDatos() {
  this.style.fontWeight = "bold";
  this.style.border = "solid";
  this.style.borderRadius = "5px";
  this.style.backgroundColor = "#C2C2C2";
  document.getElementById("idBotonEstad").style = "default";
  document.getElementById("sectionDatos").style.display = "block";
  document.getElementById("sectionEstadisticas").style.display = "none";
}

function opcionEstadisticas() {
  this.style.fontWeight = "bold";
  this.style.border = "solid";
  this.style.borderRadius = "5px";
  this.style.backgroundColor = "#C2C2C2";
  document.getElementById("idBotonDatos").style = "default";
  document.getElementById("sectionEstadisticas").style.display = "block";
  document.getElementById("sectionDatos").style.display = "none";
}

function agregarCarrera() {
  const nombre = document.getElementById("idNombre").value;
  const depto = document.getElementById("idDepartamento").value;
  const fecha = document.getElementById("idFecha").value;
  const cupo = parseInt(document.getElementById("idCupo").value);

  if (nombre && fecha && cupo > 0) {
    const nuevaCarrera = new Carrera(nombre, depto, fecha, cupo);
    const agregada = sistema.agregarCarrera(nuevaCarrera);

    if (agregada) {
      actualizarSelectCarreras();
      alert("Carrera agregada con éxito.");
      // Vaciar los campos
      document.getElementById("idNombre").value = "";
      document.getElementById("idDepartamento").selectedIndex = 0;
      document.getElementById("idFecha").value = "";
      document.getElementById("idCupo").value = 30;
    }
  } else {
    alert("Por favor, complete todos los campos correctamente.");
  }
}
function agregarActualizarPatrocinador() {
  const nombre = document.getElementById("idNombrePat").value;
  const rubro = document.getElementById("idRubro").value;
  const carrerasSelect = document.getElementById("idCarrerasPat");
  const carrerasSeleccionadas = Array.from(carrerasSelect.selectedOptions).map((opt) => opt.value);

  const carreras = sistema.carreras.filter((c) => carrerasSeleccionadas.includes(c.nombre));
  const patrocinador = new Patrocinador(nombre, rubro);

  carreras.forEach((c) => patrocinador.agregarCarrera(c));

  const agregado = sistema.agregarPatrocinador(patrocinador);

  if (agregado) {
    alert("Patrocinador agregado o actualizado.");
  }
}

function agregarCorredor() {
  const nombre = document.getElementById("idNombreCor").value;
  const edad = parseInt(document.getElementById("idEdad").value);
  const cedula = document.getElementById("idCedula").value;
  const ficha = document.getElementById("idFechaFicha").value;
  const tipoCorredor = "Deportista Común"
  if (document.getElementById("idElite").checked) {
    tipoCorredor = "Deportista de Élite"
  }
  if (nombre && !isNaN(edad) && cedula && ficha) {
    const corredor = new Corredor(nombre, edad, cedula, ficha, tipoCorredor);
    const boolean = sistema.agregarCorredor(corredor);
    if (boolean) {
      actualizarSelectCorredores();
      alert("Corredor agregado con éxito.");
    }
  } else {
    alert("Por favor, complete todos los datos del corredor.");
  }
}

function inscribirCorredor() {
  const nombreCorredor = document.getElementById("idCorredores").value;
  const nombreCarrera = document.getElementById("idCarreras").value;

  const corredorInsc = sistema.corredores.find((c) => c.nombre === nombreCorredor);
  const carrera = sistema.carreras.find((c) => c.nombre === nombreCarrera);
  const patrocinador = sistema.patrocinadores.find((c) => c.carrera === nombreCarrera);

if (corredorInsc && carrera) {
    const numero = carrera.inscripciones.length + 1;
    if (sistema.inscripciones.some((i) => i.corredor === corredor && i.carrera === carrera)) {
        alert("Este corredor ya está inscripto a esta carrera.");
        return;
    }
    if (numero >= carrera.cupo) {
      /* ERROR. porque en inscripciones se guardan TODAS las inscripciones, no solo las de esta carrera.
       Deberiamos:
       1) recorrer inscripciones[] con un for, y establecer un contador con las inscripciones cuya carrera es la misma que la que tenemos seleccionada
       2) o más facil, al pushear la primer inscripcion de una cierta carrera, definir un contador en 0, 
       y si pusheamos una carrera ya pusheada, que le suba 1 a dicho contador, pero habría que asociar el contador a la carrera o inscripción.
       3) Quizás en la clase carrera, podriamos definir un contador, con valor 0, y que al pushear una inscripción, le suba 1 a ese contador
       La opcion 3 me parece BRILLANTE! */
        alert("no hay más cupos");
        return;
    }
    if (corredorInsc.fechaFicha < carrera.fecha) {
        alert("Tiene la ficha médica vencida");
        return;
    }
    sistema.inscribirCorredor(corredorInsc, carrera, numero);
    carrera.contadorSeparado++; // para que suba el contador de inscriptos de c/carrera

    // PARA MOSTRAR EL ALERT QUE EJMPLIFICA LA LETRA
    if (patrocinador = undefined) {
      console.log(`¡Inscripción realizada con éxito!
      Número: ${numero}
      Nombre: ${corredorInsc.nombre} ${corredorInsc.edad} años, CI: ${corredorInsc.cedula} Ficha Médica ${corredorInsc.fechaFicha}
      ${corredorInsc.tipoCorredor}
      Carrera: ${carrera.nombre} en ${carrera.departamento} el ${carrera.fecha} Cupo: ${carrera.cupo}`)
    } else {
      console.log(`¡Inscripción realizada con éxito!
      Número: ${numero}
      Nombre: ${corredorInsc.nombre} ${corredorInsc.edad} años, CI: ${corredorInsc.cedula} Ficha Médica ${corredorInsc.fechaFicha}
      ${corredorInsc.tipoCorredor}
      Carrera: ${carrera.nombre} en ${carrera.departamento} el ${carrera.fecha} Cupo: ${carrera.cupo}
      ${patrocinador.nombre} (${patrocinador.rubro})`);
    } }
  }

function actualizarSelectCarreras() {
  const selects = [
    document.getElementById("idCarrerasPat"),
    document.getElementById("idCarreras"),
    document.getElementById("idCarrera"),
  ];

  const carrerasOrdenadas = [...sistema.carreras].sort((a, b) => a.nombre.localeCompare(b.nombre));

  selects.forEach((select) => {
    select.innerHTML = "";
    carrerasOrdenadas.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.nombre;
      opt.textContent = c.nombre;
      select.appendChild(opt);
    });
  });
}

function actualizarSelectCorredores() {
  const select = document.getElementById("idCorredores");
  select.innerHTML = "";

  const corredoresOrdenados = [...sistema.corredores].sort((a, b) => a.nombre.localeCompare(b.nombre));

  corredoresOrdenados.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.nombre;
    opt.textContent = c.nombre + " " + c.cedula;
    select.appendChild(opt);
  });
}

//ESTADISTICAS
google.charts.load('current', {
  'packages': ['geochart'],
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
  var data = google.visualization.arrayToDataTable([
    ['Region', 'Inscriptos'],
    ['UY-AR', 50],   // Artigas
    ['UY-CA', 100],  // Canelones
    ['UY-CL', 30],   // Cerro Largo
    ['UY-CO', 25],   // Colonia
    ['UY-DU', 60],   // Durazno
    ['UY-FD', 40],   // Florida
    ['UY-FS', 35],   // Flores
    ['UY-LA', 45],   // Lavalleja
    ['UY-MA', 90],   // Maldonado
    ['UY-MO', 200],  // Montevideo
    ['UY-PA', 70],   // Paysandú
    ['UY-RN', 20],   // Río Negro
    ['UY-RV', 55],   // Rivera
    ['UY-RO', 80],   // Rocha
    ['UY-SA', 65],   // Salto
    ['UY-SJ', 33],   // San José
    ['UY-SO', 28],   // Soriano
    ['UY-TA', 50],   // Tacuarembó
    ['UY-TT', 15]    // Treinta y Tres
  ]);

  var options = {
    region: 'UY',
    resolution: 'provinces',
    displayMode: 'regions',
    colorAxis: { colors: ['#e0f3f8', '#0868ac'] }
  };

  var chart = new google.visualization.GeoChart(document.getElementById('mapa_uruguay'));
  chart.draw(data, options);
}
