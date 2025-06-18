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
  const esElite = document.getElementById("idElite").checked;

  // FALTA PONER UN IF, que si esElite está chequeado, va esa, y sino, asignarle el otro valor
  if (nombre && !isNaN(edad) && cedula && ficha) {
    const corredor = new Corredor(nombre, edad, cedula, ficha, esElite);
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
  const patrocinador = sistema.patrocinadores.find((c) => c.carrera === nombreCarreracarrera);

  if (corredorInsc && carrera) {
    const exito = sistema.inscribirCorredor(corredorInsc, carrera, numero);
    const numero = carrera.inscripciones.length + 1;
    if (numero >= carrera.cupo) {
      alert("no hay más cupos");
    }
    if (corredorInsc.fechaFicha < carrera.fecha) {
      alert("Tiene la ficha médica vencida");
      return;
    }
    if (exito) {
      console.log(`¡Inscripción realizada con éxito!
        Número: ${numero}
        Nombre: ${corredorInsc.nombre} ${corredorInsc.edad} años, CI: ${corredorInsc.cedula} Ficha Médica ${corredorInsc.fechaFicha}
        ES ELITE? ES COMUN? que onda wachoooo
        Carrera: ${carrera.nombre} en ${carrera.departamento} el ${carrera.fecha} Cupo: ${carrera.cupo}
        ${patrocinador.nombre} (${patrocinador.rubro})`);
    } else {
      alert("No se pudo inscribir. Verifique cupo o ficha médica.");
    }
  }
  // TENEMOS QUE VER LO DE LA FICHA QUE SEA VALIDA
}

function mensajeInscripción() {
  return
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
