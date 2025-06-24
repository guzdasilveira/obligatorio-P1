// Autores: Guzmán Da Silveira y Felipe Martínez

const sistema = new Sistema();

// Botones
window.addEventListener("load", () => {
  document.getElementById("idBotonDatos").addEventListener("click", opcionDatos);
  document.getElementById("idBotonEstad").addEventListener("click", opcionEstadisticas);
  document.getElementById("idBotonAddCarr").addEventListener("click", agregarCarrera);
  document
    .getElementById("idBotonAgregarActualizar")
    .addEventListener("click", agregarActualizarPatrocinador);
  document.getElementById("idBotonAgregarCorredor").addEventListener("click", agregarCorredor);
  document.getElementById("idBotonInscribir").addEventListener("click", inscribirCorredor);
  document.getElementById("idCarrera").addEventListener("change", mostrarInscriptos);
  document
    .getElementsByName("OrdenarNombreNumero")
    .forEach((r) => r.addEventListener("change", mostrarInscriptos));
  document.getElementById("idPorCarreras").addEventListener("change", drawRegionsMap);
  document.getElementById("idPorInsc").addEventListener("change", drawRegionsMap);
});

function opcionDatos() {
  this.style.fontWeight = "bold";
  this.style.border = "solid";
  this.style.borderRadius = "5px";
  this.style.backgroundColor = "#C2C2C2";
  document.getElementById("idBotonEstad").style="default";
  document.getElementById("sectionDatos").style.display = "block";
  document.getElementById("sectionEstadisticas").style.display = "none";
}

function opcionEstadisticas() {
  this.style.fontWeight = "bold";
  this.style.border = "solid";
  this.style.borderRadius = "5px";
  this.style.backgroundColor = "#C2C2C2";
  document.getElementById("idBotonDatos").style="defualt";
  document.getElementById("sectionDatos").style.display = "none";
  document.getElementById("sectionEstadisticas").style.display = "block";
  mostrarEstadisticas();
}

function agregarCarrera() {
  const nombre = document.getElementById("idNombre").value;
  const depto = document.getElementById("idDepartamento").selectedOptions[0].text;
  const fecha = document.getElementById("idFecha").value;
  const cupo = parseInt(document.getElementById("idCupo").value);
  if (nombre && fecha && cupo > 0) {
    const nuevaCarrera = new Carrera(nombre, depto, fecha, cupo);
    if (sistema.agregarCarrera(nuevaCarrera)) {
      actualizarSelectCarreras();
      alert("Carrera agregada con éxito");
    }
  } else {
    alert("Complete todos los campos correctamente");
  }
}

function agregarActualizarPatrocinador() {
  const nombre = document.getElementById("idNombrePat").value;
  const rubro = document.getElementById("idRubro").value;
  const seleccionadas = Array.from(document.getElementById("idCarrerasPat").selectedOptions);
  const carreras = [];
  for (let i = 0; i < sistema.carreras.length; i++) {
    for (let j = 0; j < seleccionadas.length; j++) {
      if (seleccionadas[j].value === sistema.carreras[i].nombre) {
        carreras.push(sistema.carreras[i]);
      }
    }
  }
  const p = new Patrocinador(nombre, rubro);
  carreras.forEach((c) => p.agregarCarrera(c));
  if (sistema.agregarPatrocinador(p)) alert("Patrocinador agregado/actualizado");
}

function agregarCorredor() {
  const nombre = document.getElementById("idNombreCor").value;
  const edad = parseInt(document.getElementById("idEdad").value);
  const cedula = document.getElementById("idCedula").value;
  const ficha = document.getElementById("idFechaFicha").value;
  const tipo = document.getElementById("idElite").checked ? "Deportista de Élite" : "Deportista Común";
  if (nombre && !isNaN(edad) && cedula && ficha) {
    const corredor = new Corredor(nombre, edad, cedula, ficha, tipo);
    if (sistema.agregarCorredor(corredor)) {
      actualizarSelectCorredores();
      alert("Corredor agregado con éxito");
    }
  } else {
    alert("Complete todos los datos correctamente");
  }
}

function inscribirCorredor() {
  const nombreCor = document.getElementById("idCorredores").value;
  const nombreCar = document.getElementById("idCarreras").value;
  let corredor = null;
  let carrera = null;

  for (let i = 0; i < sistema.corredores.length; i++) {
    if (sistema.corredores[i].nombre === nombreCor) {
      corredor = sistema.corredores[i];
    }
  }

  for (let i = 0; i < sistema.carreras.length; i++) {
    if (sistema.carreras[i].nombre === nombreCar) {
      carrera = sistema.carreras[i];
    }
  }

  if (!corredor || !carrera) {
    alert("Seleccione un corredor y una carrera");
  }

  inscripcionPrevia ();

  console.log("Fecha de carrera:", carrera.fecha);
  console.log("Fecha ficha médica:", corredor.fechaFicha);

  const fechaCarrera = new Date(carrera.fecha);
  const fechaFicha = new Date(corredor.fechaFicha);
  fechaCarrera.setHours(0, 0, 0, 0);
  fechaFicha.setHours(0, 0, 0, 0);

  console.log("Fecha carrera normalizada:", fechaCarrera);
  console.log("Fecha ficha normalizada:", fechaFicha);

  validarVigencia (fechaFicha, fechaCarrera);
  validarCupo(carrera.contadorPorCarrera, carrera.cupo);

  if (corredor && carrera && inscripcionPrevia && validarVigencia && validarCupo) {
    carrera.contadorPorCarrera++;
    sistema.inscribirCorredor(corredor, carrera, carrera.contadorPorCarrera);
    alert("Inscripción realizada con éxito");
    mostrarInscriptos();
  }
}

function inscripcionPrevia () {
  let yaInscripto = false;
  let i = 0;
  while (i < sistema.inscripciones.length && yaInscripto == false) {
    if ((sistema.inscripciones[i].corredor == corredor) && (sistema.inscripciones[i].carrera == carrera)) {
        yaInscripto = true;
        alert ("Corredor ya inscripto");
        return true;
      }
    }
    i = i + 1;
}

function validarVigencia (fichaMedica, fechaCarrera){
  if(fichaMedica<fechaCarrera) {
    alert("Ficha médica vencida para esta carrera");
  } else {
    return true;
  }
}

function validarCupo (contador, cupo) {
  if (contador >= cupo) {
    alert("Cupos agotados");
  }else {
    return true;
  }
}

function inscripcionExitosa(numero, corredor, carrera, patrocinador) {
  if (patrocinador = undefined) {
  console.log(`¡Inscripción realizada con éxito!
  Número: ${numero}
  Nombre: ${corredor.nombre} ${corredor.edad} años, CI: ${corredor.cedula} Ficha Médica ${corredor.fechaFicha}
  ${corredor.tipoCorredor}
  Carrera: ${carrera.nombre} en ${carrera.departamento} el ${carrera.fecha} Cupo: ${carrera.cupo}`)
  } else {
    console.log(`¡Inscripción realizada con éxito!
    Número: ${numero}
    Nombre: ${corredorInsc.nombre} ${corredorInsc.edad} años, CI: ${corredorInsc.cedula} Ficha Médica ${corredorInsc.fechaFicha}
    ${corredor.tipoCorredor}
    Carrera: ${carrera.nombre} en ${carrera.departamento} el ${carrera.fecha} Cupo: ${carrera.cupo}
    ${patrocinador.nombre} (${patrocinador.rubro})`);
    }
}

function actualizarSelectCarreras() {
  const selects = ["idCarrerasPat", "idCarreras", "idCarrera"];
  for (let s = 0; s < selects.length; s++) {
    const select = document.getElementById(selects[s]);
    select.innerHTML = "";
    const ordenadas = [...sistema.carreras].sort((a, b) => a.nombre.localeCompare(b.nombre));
    for (let i = 0; i < ordenadas.length; i++) {
      const opt = document.createElement("option");
      opt.value = ordenadas[i].nombre;
      opt.textContent = ordenadas[i].nombre;
      select.appendChild(opt);
    }
  }
}

function actualizarSelectCorredores() {
  const select = document.getElementById("idCorredores");
  select.innerHTML = "";
  const ordenados = [...sistema.corredores].sort((a, b) => a.nombre.localeCompare(b.nombre));
  for (let i = 0; i < ordenados.length; i++) {
    const opt = document.createElement("option");
    opt.value = ordenados[i].nombre;
    opt.textContent = `${ordenados[i].nombre} (${ordenados[i].cedula})`;
    select.appendChild(opt);
  }
}

function mostrarInscriptos() {
  const nombreCar = document.getElementById("idCarrera").value;
  const ordenarPorNombre = document.getElementById("idNombreBis").checked;
  const tabla = document.querySelector("table");
  tabla.innerHTML = `
    <tr>
      <th>Nombre</th>
      <th>Edad</th>
      <th>Cédula</th>
      <th>Ficha Médica</th>
      <th>Número</th>
    </tr>`;
  const inscripciones = [];
  for (let i = 0; i < sistema.inscripciones.length; i++) {
    if (sistema.inscripciones[i].carrera.nombre === nombreCar) {
      inscripciones.push(sistema.inscripciones[i]);
    }
  }
  const ordenadas = inscripciones.sort((a, b) => {
    if (ordenarPorNombre) {
      return a.corredor.nombre.localeCompare(b.corredor.nombre);
    } else {
      return a.numero - b.numero;
    }
  });
  for (let i = 0; i < ordenadas.length; i++) {
    const insc = ordenadas[i];
    const fila = document.createElement("tr");
    fila.innerHTML = `
    <td style="border: 1px solid black;">${insc.corredor.nombre}</td>
    <td style="border: 1px solid black;">${insc.corredor.edad}</td>
    <td style="border: 1px solid black;">${insc.corredor.cedula}</td>
    <td style="border: 1px solid black;">${insc.corredor.fechaFicha.toLocaleDateString()}</td>
    <td style="border: 1px solid black;">${insc.numero}</td>`;

    if (insc.corredor.tipoCorredor === "Deportista de Élite") fila.background.color = "red";
    tabla.appendChild(fila);
  }
}

function mostrarEstadisticas() {
  document.getElementById("lblPromedio").textContent =
    "Promedio de inscriptos por carrera: " + sistema.promedioInscriptos();
  const carrerasSinInscriptos = sistema.carreras.filter((c) => c.contadorPorCarrera === 0);
  const ul = document.querySelector("ul");
  ul.innerHTML = "";
  carrerasSinInscriptos
    .sort((a, b) => a.fecha - b.fecha)
    .forEach((c) => {
      const li = document.createElement("li");
      li.textContent = `${c.nombre} (${c.fecha.toLocaleDateString()})`;
      ul.appendChild(li);
    });
  // Más inscriptos
  let max = 0;
  let nombres = [];
  for (let i = 0; i < sistema.carreras.length; i++) {
    if (sistema.carreras[i].contadorPorCarrera > max) {
      max = sistema.carreras[i].contadorPorCarrera;
      nombres = [sistema.carreras[i].nombre];
    } else if (sistema.carreras[i].contadorPorCarrera === max) {
      nombres.push(sistema.carreras[i].nombre);
    }
  }
  document.getElementById("lblMasInscriptos").textContent =
    "Carrera/s con más inscriptos: " + nombres.join(", ");
  // % Elite
  const elite = sistema.corredores.filter((c) => c.tipoCorredor === "Deportista de Élite").length;
  const total = sistema.corredores.length;
  const porcentaje = null;
  if (total < 0) {
    porcentaje="sin datos";
  } else {
    porcentaje=((elite / total) * 100).toFixed(2);
  }
  document.getElementById("lblPorcentaje").textContent = `Porcentaje de corredores de élite: ${porcentaje}%`;
}

google.charts.load("current", {
  packages: ["geochart"],
});

google.charts.setOnLoadCallback(drawRegionsMap);

// Mapa dinámico
function drawRegionsMap() {
  const contadorPorDepto = {};
  const porCarreras = document.getElementById("idPorCarreras").checked;

  sistema.carreras.forEach((c) => {
    const clave = `UY-${c.departamento.substring(0, 2).toUpperCase()}`;
    if (!contadorPorDepto[clave]) contadorPorDepto[clave] = 0;
    if (porCarreras) {
      contadorPorDepto[clave]++;
    } else {
      contadorPorDepto[clave] += c.contadorPorCarrera;
    }
  });

  const data = google.visualization.arrayToDataTable([
    ["Region", porCarreras ? "Carreras" : "Inscriptos"],
    ...Object.entries(contadorPorDepto),
  ]);

  const chart = new google.visualization.GeoChart(document.getElementById("mapa_uruguay"));
  const options = {
    region: "UY",
    resolution: "provinces",
    displayMode: "regions",
    colorAxis: { colors: ["#e0f3f8", "#0868ac"] },
  };
  chart.draw(data, options);
}
