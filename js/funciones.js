// Autores: Guzmán Da Silveira y Felipe Martínez

const sistema = new Sistema();

// Botones
window.addEventListener("load", () => {
  opcionDatos();
  document.getElementById("idBotonDatos").addEventListener("click", opcionDatos);
  document.getElementById("idBotonEstad").addEventListener("click", opcionEstadisticas);
  document.getElementById("idCarrera").addEventListener("change", mostrarInscriptos);
  let radios = document.getElementsByName("OrdenarNombreNumero");
  for (let i = 0; i < radios.length; i = i + 1) {
    radios[i].addEventListener("change", mostrarInscriptos);
  }

  document.getElementById("idPorCarreras").addEventListener("change", drawRegionsMap);
  document.getElementById("idPorInsc").addEventListener("change", drawRegionsMap);
  document.getElementById("formCarreras").addEventListener("submit", agregarCarrera);
  document.getElementById("formPatrocinadores").addEventListener("submit", agregarActualizarPatrocinador);
  document.getElementById("formCorredores").addEventListener("submit", agregarCorredor);
  document.getElementById("formInscripciones").addEventListener("submit", inscribirCorredor);
});

function opcionDatos() {
  const botonDatos = document.getElementById("idBotonDatos");
  const botonEstad = document.getElementById("idBotonEstad");

  botonDatos.style.fontWeight = "bold";
  botonDatos.style.border = "solid";
  botonDatos.style.borderRadius = "5px";
  botonDatos.style.backgroundColor = "#C2C2C2";

  botonEstad.removeAttribute("style");

  document.getElementById("sectionDatos").style.display = "block";
  document.getElementById("sectionEstadisticas").style.display = "none";
}

function opcionEstadisticas() {
  const botonEstad = document.getElementById("idBotonEstad");
  const botonDatos = document.getElementById("idBotonDatos");

  botonEstad.style.fontWeight = "bold";
  botonEstad.style.border = "solid";
  botonEstad.style.borderRadius = "5px";
  botonEstad.style.backgroundColor = "#C2C2C2";

  botonDatos.removeAttribute("style");

  document.getElementById("sectionDatos").style.display = "none";
  document.getElementById("sectionEstadisticas").style.display = "block";
  mostrarEstadisticas();
}

function agregarCarrera(event) {
  event.preventDefault();
  const nombre = document.getElementById("idNombre").value;
  const depto = document.getElementById("idDepartamento").selectedOptions[0].text;
  const fecha = document.getElementById("idFecha").value;
  const cupo = parseInt(document.getElementById("idCupo").value);
  const hoy = new Date();
  const fechaCarrera = new Date(fecha);
  hoy.setHours(0, 0, 0, 0);
  fechaCarrera.setHours(0, 0, 0, 0);
  console.log("fecha:", fecha);
  if (fechaCarrera <= hoy) {
    alert("La fecha de la carrera debe ser posterior a hoy");
    return;
  }
  if (nombre && fecha && cupo > 0) {
    const nuevaCarrera = new Carrera(nombre, depto, fecha, cupo);
    if (sistema.agregarCarrera(nuevaCarrera)) {
      actualizarSelectCarreras();
      alert("Carrera agregada con éxito");
      drawRegionsMap();
      event.target.reset();
    }
  } else {
    alert("Complete todos los campos correctamente");
  }
}

function agregarActualizarPatrocinador(event) {
  event.preventDefault();
  const nombre = document.getElementById("idNombrePat").value;
  const rubro = document.getElementById("idRubro").value;
  let lista = document.getElementById("idCarrerasPat");
  let seleccionadas = [];
  for (let i = 0; i < lista.options.length; i = i + 1) {
    if (lista.options[i].selected) {
      seleccionadas.push(lista.options[i]);
    }
  }

  const carreras = [];
  for (let i = 0; i < sistema.carreras.length; i++) {
    for (let j = 0; j < seleccionadas.length; j++) {
      if (seleccionadas[j].value === sistema.carreras[i].nombre) {
        carreras.push(sistema.carreras[i]);
      }
    }
  }
  const p = new Patrocinador(nombre, rubro);
  for (let i = 0; i < carreras.length; i = i + 1) {
    p.agregarCarrera(carreras[i]);
  }

  if (sistema.agregarPatrocinador(p)) {
    alert("Patrocinador agregado/actualizado");
    event.target.reset();
  }
}

function agregarCorredor(event) {
  event.preventDefault();
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
      event.target.reset();
    }
  } else {
    alert("Complete todos los datos correctamente");
  }
}

function inscribirCorredor(event) {
  event.preventDefault();
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

    if (
      inscripcionPrevia(corredor, carrera) &&
      validarVigencia(fechaFicha, fechaCarrera) &&
      validarCupo(carrera.contadorPorCarrera, carrera.cupo)
    ) {
      sistema.inscribirCorredor(corredor, carrera, carrera.contadorPorCarrera + 1);
      inscripcionExitosa(carrera.contadorPorCarrera, corredor, carrera);
      mostrarInscriptos();
      drawRegionsMap();
      event.target.reset();
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
          textoPatrocinadores =
            sistema.patrocinadores[i].nombre + " (" + sistema.patrocinadores[i].rubro + ")";
        } else {
          textoPatrocinadores =
            textoPatrocinadores +
            " / " +
            sistema.patrocinadores[i].nombre +
            " (" +
            sistema.patrocinadores[i].rubro +
            ")";
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
  Carrera: ${carrera.nombre} en ${carrera.departamento} el ${formatearFecha(carrera.fecha)} Cupo: ${
    carrera.cupo
  }
  ${textoPatrocinadores}`;
  alert(mensaje);
  generarPDFInscripcion(mensaje, corredor, carrera, numero);
}

function generarPDFInscripcion(mensaje, corredor, carrera, numero) {
  const doc = new window.jspdf.jsPDF();

  doc.setFontSize(12);
  doc.text(mensaje, 10, 20);

  const nombreArchivo = `Inscripcion_${corredor.nombre.replaceAll(" ", "_")}_${carrera.nombre.replaceAll(
    " ",
    "_"
  )}_${numero}.pdf`;
  doc.save(nombreArchivo);
}

function actualizarSelectCarreras() {
  const selects = ["idCarrerasPat", "idCarreras", "idCarrera"];
  for (let s = 0; s < selects.length; s++) {
    const select = document.getElementById(selects[s]);
    select.innerHTML = "";
    let copiaCarreras = sistema.carreras.slice();
    copiaCarreras.sort(function (a, b) {
      if (a.nombre > b.nombre) {
        return 1;
      } else {
        return -1;
      }
    });

    for (let i = 0; i < copiaCarreras.length; i = i + 1) {
      const opt = document.createElement("option");
      opt.value = copiaCarreras[i].nombre;
      opt.textContent = copiaCarreras[i].nombre;
      select.appendChild(opt);
    }
  }
}

function actualizarSelectCorredores() {
  const select = document.getElementById("idCorredores");
  select.innerHTML = "";
  let ordenados = sistema.corredores.slice();
  ordenados.sort(function (a, b) {
    if (a.nombre > b.nombre) {
      return 1;
    } else {
      return -1;
    }
  });

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
  let ordenadas = inscripciones.slice();
  if (ordenarPorNombre) {
    ordenadas.sort(function (a, b) {
      if (a.corredor.nombre > b.corredor.nombre) {
        return 1;
      } else {
        return -1;
      }
    });
  } else {
    ordenadas.sort(function (a, b) {
      return a.numero - b.numero;
    });
  }

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

  // sin inscriptos
  let carrerasSinInscriptos = [];
  for (let i = 0; i < sistema.carreras.length; i = i + 1) {
    if (sistema.carreras[i].contadorPorCarrera === 0) {
      carrerasSinInscriptos.push(sistema.carreras[i]);
    }
  }
  const ul = document.getElementById("ulSinInscriptos");
  ul.innerHTML = "";

  if (carrerasSinInscriptos.length === 0) {
    const li = document.createElement("li");
    li.textContent = "sin datos";
    ul.appendChild(li);
  } else {
    let copia = carrerasSinInscriptos.slice();
    copia.sort(function (a, b) {
      return a.fecha - b.fecha;
    });
    for (let i = 0; i < copia.length; i = i + 1) {
      let c = copia[i];
      let li = document.createElement("li");
      li.textContent =
        c.nombre + " en " + c.departamento + " el " + c.fecha.toLocaleDateString() + " Cupo: " + c.cupo;
      ul.appendChild(li);
    }
  }

  // más inscriptos
  let max = 0;
  let carrerasMax = [];
  for (let i = 0; i < sistema.carreras.length; i++) {
    const carrera = sistema.carreras[i];
    if (carrera.contadorPorCarrera > max) {
      max = carrera.contadorPorCarrera;
      carrerasMax = [carrera];
    } else if (carrera.contadorPorCarrera === max && max > 0) {
      carrerasMax.push(carrera);
    }
  }

  const ulMas = document.getElementById("ulMasInscriptos");
  ulMas.innerHTML = "";
  if (carrerasMax.length === 0) {
    const li = document.createElement("li");
    li.textContent = "sin datos";
    ulMas.appendChild(li);
  } else {
    for (let i = 0; i < carrerasMax.length; i = i + 1) {
      let carrera = carrerasMax[i];
      let li = document.createElement("li");
      li.textContent =
        carrera.nombre +
        " en " +
        carrera.departamento +
        " el " +
        carrera.fecha.toLocaleDateString() +
        " Cupo: " +
        carrera.cupo +
        " inscriptos: " +
        carrera.contadorPorCarrera;
      ulMas.appendChild(li);
    }
  }

  //% Elite
  let elite = 0;
  for (let i = 0; i < sistema.corredores.length; i = i + 1) {
    if (sistema.corredores[i].tipoCorredor === "Deportista de Élite") {
      elite = elite + 1;
    }
  }
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

const codigos = {
    "Artigas": "UY-AR",
    "Canelones": "UY-CA",
    "Cerro Largo": "UY-CL",
    "Colonia": "UY-CO",
    "Durazno": "UY-DU",
    "Flores": "UY-FS",
    "Florida": "UY-FD",
    "Lavalleja": "UY-LA",
    "Maldonado": "UY-MA",
    "Montevideo": "UY-MO",
    "Paysandú": "UY-PA",
    "Río Negro": "UY-RN",
    "Rivera": "UY-RV",
    "Rocha": "UY-RO",
    "Salto": "UY-SA",
    "San José": "UY-SJ",
    "Soriano": "UY-SO",
    "Tacuarembó": "UY-TA",
    "Treinta y Tres": "UY-TT",
};

// Mapa dinámico
function drawRegionsMap() {
  const contadorPorDepto = {};
  const porCarreras = document.getElementById("idPorCarreras").checked;

  for (let i = 0; i < sistema.carreras.length; i = i + 1) {
   let c = sistema.carreras[i];
   let clave = codigos[c.departamento];
    if (!contadorPorDepto[clave]) {
      contadorPorDepto[clave] = 0;
    }
    if (porCarreras) {
      contadorPorDepto[clave] = contadorPorDepto[clave] + 1;
    } else {
      contadorPorDepto[clave] = contadorPorDepto[clave] + c.contadorPorCarrera;
    }
  }

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
