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
    sistema.agregarCarrera(nuevaCarrera);
    actualizarSelectCarreras();

    // Seleccionar automáticamente la nueva carrera en los selects
    document.getElementById("idCarrerasPat").value = nombre;
    document.getElementById("idCarreras").value = nombre;
    document.getElementById("idCarrera").value = nombre;

    alert("Carrera agregada con éxito.");

    // Vaciar los campos
    document.getElementById("idNombre").value = "";
    document.getElementById("idDepartamento").selectedIndex = 0;
    document.getElementById("idFecha").value = "";
    document.getElementById("idCupo").value = "";
    document.getElementById("idNombre").focus();
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
  sistema.agregarPatrocinador(patrocinador);

  alert("Patrocinador agregado o actualizado.");
}

function agregarCorredor() {
  const nombre = document.getElementById("idNombreCor").value;
  const edad = parseInt(document.getElementById("idEdad").value);
  const cedula = document.getElementById("idCedula").value;
  const ficha = document.getElementById("idFechaFicha").value;
  const esElite = document.getElementById("idElite").checked;

  if (nombre && !isNaN(edad) && cedula && ficha) {
    const corredor = new Corredor(nombre, edad, cedula, ficha, esElite);
    sistema.agregarCorredor(corredor);
    actualizarSelectCorredores();
    alert("Corredor agregado con éxito.");
  } else {
    alert("Por favor, complete todos los datos del corredor.");
  }
}

function inscribirCorredor() {
  const nombreCorredor = document.getElementById("idCorredores").value;
  const nombreCarrera = document.getElementById("idCarreras").value;

  const corredor = sistema.corredores.find((c) => c.nombre === nombreCorredor);
  const carrera = sistema.carreras.find((c) => c.nombre === nombreCarrera);

  if (corredor && carrera) {
    const numero = carrera.inscripciones.length + 1;
    const exito = sistema.inscribirCorredor(corredor, carrera, numero);
    if (exito) {
      alert("Corredor inscrito con éxito.");
    } else {
      alert("No se pudo inscribir. Verifique cupo o ficha médica.");
    }
  }
}

function actualizarSelectCarreras() {
  const selects = [
    document.getElementById("idCarrerasPat"),
    document.getElementById("idCarreras"),
    document.getElementById("idCarrera"),
  ];
  selects.forEach((select) => {
    //  select.innerHTML = "";
    sistema.carreras.forEach((c) => {
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
  sistema.corredores.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.nombre;
    opt.textContent = c.nombre;
    select.appendChild(opt);
  });
}
