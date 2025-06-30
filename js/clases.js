// Autores: Guzmán Da Silveira y Felipe Martínez

class Carrera {
  constructor(nombre, departamento, fecha, cupo) {
    this.nombre = nombre;
    this.departamento = departamento;
    this.fecha = new Date(fecha);
    this.cupo = cupo;
    this.contadorPorCarrera = 0;
  }
}

class Corredor {
  constructor(nombre, edad, cedula, fechaFicha, tipoCorredor) {
    this.nombre = nombre;
    this.edad = edad;
    this.cedula = cedula;
    this.fechaFicha = new Date(fechaFicha);
    this.tipoCorredor = tipoCorredor;
  }

  esMayor() {
    return this.edad >= 18;
  }

  tieneFichaVigente(fechaCarrera) {
    return this.fechaFicha >= fechaCarrera;
  }
}

class Inscripcion {
  constructor(corredor, carrera, numero) {
    this.corredor = corredor;
    this.carrera = carrera;
    this.numero = numero;
  }
}

class Patrocinador {
  constructor(nombre, rubro) {
    this.nombre = nombre;
    this.rubro = rubro;
    this.carreras = [];
  }

  agregarCarrera(carrera) {
    for (let i = 0; i < this.carreras.length; i++) {
      if (this.carreras[i].nombre === carrera.nombre) return;
    }
    this.carreras.push(carrera);
  }
}

class Sistema {
  constructor() {
    this.carreras = [];
    this.corredores = [];
    this.inscripciones = [];
    this.patrocinadores = [];
  }

  agregarCarrera(carrera) {
    for (let i = 0; i < this.carreras.length; i++) {
      if (this.carreras[i].nombre.toLowerCase() === carrera.nombre.toLowerCase()) {
        alert("Ya existe una carrera con ese nombre.");
        return false;
      }
    }
    this.carreras.push(carrera);
    return true;
  }

  agregarCorredor(corredor) {
    for (let i = 0; i < this.corredores.length; i++) {
      if (this.corredores[i].cedula === corredor.cedula) {
        alert("Esa cédula ya fue registrada.");
        return false;
      }
    }
    if (!corredor.esMayor()) {
      alert("El corredor debe ser mayor de edad.");
      return false;
    }
    this.corredores.push(corredor);
    return true;
  }

  agregarPatrocinador(patrocinador) {
    if (!patrocinador.carreras || patrocinador.carreras.length === 0) {
      alert("Debe seleccionar al menos una carrera.");
      return false;
    }

    let yaExiste = false;
    let i = 0;
    while (i < this.patrocinadores.length && !yaExiste) {
      if (this.patrocinadores[i].nombre === patrocinador.nombre) {
        this.patrocinadores[i].rubro = patrocinador.rubro;
        this.patrocinadores[i].carreras = patrocinador.carreras;
        yaExiste = true;
      }
      i++;
    }
    if (!yaExiste) {
      this.patrocinadores.push(patrocinador);
      return true;
    }
  }

  inscribirCorredor(corredor, carrera, numero) {
    const inscripcion = new Inscripcion(corredor, carrera, numero);
    this.inscripciones.push(inscripcion);
    carrera.contadorPorCarrera++;
    return true;
  }

  promedioInscriptos() {
    if (this.carreras.length === 0) return "sin datos";
    else {
      let suma = 0;
      for (let i = 0; i < this.carreras.length; i++) {
        suma += this.carreras[i].contadorPorCarrera;
      }
      return (suma / this.carreras.length).toFixed(2);
    }
  }

  porcentajeElite() {
    if (this.corredores.length === 0) return "0%";
    let elite = 0;
    for (let i = 0; i < this.corredores.length; i++) {
      if (this.corredores[i].tipoCorredor === "Deportista de Élite") elite++;
    }
    return ((elite / this.corredores.length) * 100).toFixed(2) + "%";
  }

  carreraMasInscriptos() {
    let max = 0;
    let resultado = [];
    for (let i = 0; i < this.carreras.length; i++) {
      if (this.carreras[i].contadorPorCarrera > max) {
        max = this.carreras[i].contadorPorCarrera;
      }
    }
    for (let i = 0; i < this.carreras.length; i++) {
      if (this.carreras[i].contadorPorCarrera === max && max > 0) {
        resultado.push(this.carreras[i].nombre);
      }
    }
    return resultado.length > 0 ? resultado : ["Sin datos"];
  }

  carrerasSinInscriptos() {
    let vacias = [];
    for (let i = 0; i < this.carreras.length; i++) {
      if (this.carreras[i].contadorPorCarrera === 0) vacias.push(this.carreras[i]);
    }
    return vacias.sort(function (a, b) {
      return a.fecha - b.fecha;
    });
  }

  conteoPorDepartamento() {
    let conteo = {};
    for (let i = 0; i < this.carreras.length; i++) {
      const dep = this.carreras[i].departamento;
      if (!conteo[dep]) conteo[dep] = 0;
      conteo[dep]++;
    }
    return conteo;
  }
}

function drawRegionsMap() {
  const conteo = sistema.conteoPorDepartamento();
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

  const dataArray = [["Region", "Cantidad"]];
  for (let dep in conteo) {
    if (codigos[dep]) dataArray.push([codigos[dep], conteo[dep]]);
  }

  const data = google.visualization.arrayToDataTable(dataArray);
  const options = {
    region: "UY",
    resolution: "provinces",
    displayMode: "regions",
    colorAxis: { colors: ["#e0f3f8", "#0868ac"] },
  };

  const chart = new google.visualization.GeoChart(document.getElementById("mapa_uruguay"));
  chart.draw(data, options);
}
