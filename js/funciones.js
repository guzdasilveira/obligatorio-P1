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
  document.getElementById("idBotonEstad").style = "default";
  document.getElementById("sectionDatos").style.display = "block";
  document.getElementById("sectionEstadisticas").style.display = "none";
}

function opcionEstadisticas() {
  this.style.fontWeight = "bold";
  this.style.border = "solid";
  this.style.borderRadius = "5px";
  this.style.backgroundColor = "#C2C2C2";
  document.getElementById("idBotonDatos").style = "defualt";
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
      drawRegionsMap();
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
  } else {

    const fechaCarrera = new Date(carrera.fecha);
    const fechaFicha = new Date(corredor.fechaFicha);

    if (inscripcionPrevia(corredor, carrera) && validarVigencia(fechaFicha, fechaCarrera) && validarCupo(carrera.contadorPorCarrera, carrera.cupo)) {
      sistema.inscribirCorredor(corredor, carrera, carrera.contadorPorCarrera + 1);
      inscripcionExitosa(carrera.contadorPorCarrera, corredor, carrera);
      mostrarInscriptos();
      drawRegionsMap();
    }
  }
}

function inscripcionPrevia(corredor, carrera) {
  for (let i = 0; i < sistema.inscripciones.length; i++) {
    if (sistema.inscripciones[i].corredor === corredor && sistema.inscripciones[i].carrera === carrera) {
      alert("Corredor ya inscripto");
      return false;
    }
  }
  return true;
}

function validarVigencia(fichaMedica, fechaCarrera) {
  if (fichaMedica < fechaCarrera) {
    alert("Ficha médica vencida para esta carrera");
    return false;
  } else {
    return true;
  }
}

function validarCupo(contador, cupo) {
  if (contador >= cupo) {
    alert("Cupos agotados");
    return false;
  } else {
    return true;
  }
}
function formatearFecha(fecha) {
  const d = new Date(fecha);
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function inscripcionExitosa(numero, corredor, carrera) {
  let textoPatrocinadores = "";
  for (let i = 0; i < sistema.patrocinadores.length; i++) {
  let carrerasPat = sistema.patrocinadores[i].carreras;
  for (let j = 0; j < carrerasPat.length; j++) {
    if (carrerasPat[j] === carrera) {
      if (textoPatrocinadores.length === 0) {
        textoPatrocinadores = sistema.patrocinadores[i].nombre + " (" + sistema.patrocinadores[i].rubro + ")";
      } else {
        textoPatrocinadores = textoPatrocinadores + " / " + sistema.patrocinadores[i].nombre + " (" + sistema.patrocinadores[i].rubro + ")";
      }
    }
  }
}
  let mensaje = `¡Inscripción realizada con éxito!
  Número: ${numero}
  Nombre: ${corredor.nombre} ${corredor.edad} años, CI: ${corredor.cedula} Ficha Médica ${formatearFecha(
    corredor.fechaFicha
  )}
  ${corredor.tipoCorredor}
  Carrera: ${carrera.nombre} en ${carrera.departamento} el ${formatearFecha(carrera.fecha)} Cupo: ${carrera.cupo}
  ${textoPatrocinadores}`;  
  alert(mensaje);
  generarPDFInscripcion(mensaje, corredor, carrera, numero);
}

function generarPDFInscripcion(mensaje, corredor, carrera, numero) {
  const doc = new window.jspdf.jsPDF();

  doc.setFontSize(12);
  doc.text(mensaje, 10, 20);

  const nombreArchivo = `Inscripcion_${corredor.nombre.replaceAll(" ", "_")}_${carrera.nombre.replaceAll(" ", "_")}_${numero}.pdf`;
  doc.save(nombreArchivo);
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

    if (insc.corredor.tipoCorredor === "Deportista de Élite") fila.style.backgroundColor = "red";
    tabla.appendChild(fila);
  }
}

function mostrarEstadisticas() {
  const promedio = sistema.promedioInscriptos();
  document.getElementById("lblPromedio").textContent =
    "Promedio de inscriptos por carrera: " + (promedio !== "Sin datos" ? promedio : "sin datos");

  //sin inscriptos
  const carrerasSinInscriptos = sistema.carreras.filter((c) => c.contadorPorCarrera === 0);
  const ul = document.getElementById("ulSinInscriptos");
  ul.innerHTML = "";
  if (carrerasSinInscriptos.length === 0) {
    const li = document.createElement("li");
    li.textContent = "sin datos";
    ul.appendChild(li);
  } else {
    carrerasSinInscriptos
      .sort((a, b) => a.fecha - b.fecha)
      .forEach((c) => {
        const li = document.createElement("li");
        li.textContent = `${c.nombre} (${c.fecha.toLocaleDateString()})`;
        ul.appendChild(li);
      });
  }

  //mas inscriptos
  let max = 0;
  let nombres = [];
  for (let i = 0; i < sistema.carreras.length; i++) {
    if (sistema.carreras[i].contadorPorCarrera > max) {
      max = sistema.carreras[i].contadorPorCarrera;
      nombres = [sistema.carreras[i].nombre];
    } else if (sistema.carreras[i].contadorPorCarrera === max && max > 0) {
      nombres.push(sistema.carreras[i].nombre);
    }
  }

  const ulMas = document.getElementById("ulMasInscriptos");
  ulMas.innerHTML = "";
  if (nombres.length === 0) {
    const li = document.createElement("li");
    li.textContent = "sin datos";
    ulMas.appendChild(li);
  } else {
    nombres.forEach((nombre) => {
      const li = document.createElement("li");
      li.textContent = nombre;
      ulMas.appendChild(li);
    });
  }

  //% Elite
  const elite = sistema.corredores.filter((c) => c.tipoCorredor === "Deportista de Élite").length;
  const total = sistema.corredores.length;
  let porcentaje;
  if (total === 0) {
    porcentaje = "sin datos";
  } else {
    porcentaje = ((elite / total) * 100).toFixed(2) + "%";
  }
  document.getElementById("lblPorcentaje").textContent = "Porcentaje de corredores de élite: " + porcentaje;
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
