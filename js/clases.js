// Autores: Guzmán Da Silveira y Felipe Martínez

class Carrera {
  constructor(nombre, departamento, fecha, cupo) {
    this.nombre = nombre;
    this.departamento = departamento;
    this.fecha = new Date(fecha);
    this.cupo = cupo;
    this.inscripciones = [];
  }

  hayCupo() {
<<<<<<< HEAD
    return this.inscripciones.length < this.cupo;
=======
    const boolean = this.inscripciones.length < this.cupo;
    return boolean;
>>>>>>> 820d6f0ecc1f669db14672c2e0ce6405c4cb1704
  }

  agregarInscripcion(inscripcion) {
    if (this.hayCupo()) {
      this.inscripciones.push(inscripcion);
    }
  }

  cantidadInscriptos() {
    return this.inscripciones.length;
  }
  // agregar ToString()
}

class Corredor {
  constructor(nombre, edad, cedula, fechaFicha, esElite) {
    this.nombre = nombre;
    this.edad = edad;
    this.cedula = cedula;
    this.fechaFicha = new Date(fechaFicha);
    this.esElite = esElite;
  }
  esMayor() {
    if (this.edad >= 18) {
      return true;
    } else {
      return false;
    }
  }
  cedulaUnica() {
    for (let i = 0; i < this.cedula.length; i++) {
      if (this.cedula === corredores.cedula[i]) {
        alert("Esa cedula ya fue registrada.");
        return false;
      }
    }
  }
<<<<<<< HEAD
=======

  tieneFichaVigente() {
    const today = new Date();
    const vigente = this.fechaFicha >= today;
    if (vigente) {
    } else {
    }
    return vigente;
  }
>>>>>>> 820d6f0ecc1f669db14672c2e0ce6405c4cb1704
  // agregar ToString()
}

class Inscripcion {
  constructor(corredor, carrera, numero) {
    this.corredor = corredor;
    this.carrera = carrera;
    this.numero = numero;
  }
  // agregar ToString()
}

class Patrocinador {
  constructor(nombre, rubro) {
    this.nombre = nombre;
    this.rubro = rubro;
    this.carreras = [];
  }

  agregarCarrera(carrera) {
    if (!this.carreras.includes(carrera)) {
      this.carreras.push(carrera);
    }
  }
  // agregar ToString()
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
<<<<<<< HEAD
    const existe = this.corredores.some((c) => c.cedula === corredor.cedula);
    if (existe) {
      alert("Esa cédula ya fue registrada.");
      return false;
    }
    if (corredor.edad < 18) {
      alert("El corredor debe ser mayor de edad.");
      return false;
    }
    this.corredores.push(corredor);
    return true;
=======
    cedulaUnica();
    esMayor();
    this.corredores.push(corredor);
>>>>>>> 820d6f0ecc1f669db14672c2e0ce6405c4cb1704
  }

  agregarPatrocinador(patrocinador) {
    if (!patrocinador.carreras || patrocinador.carreras.length === 0) {
      alert("Debe seleccionar al menos una carrera.");
      return false;
    }
    let existente = this.patrocinadores.find((p) => p.nombre === patrocinador.nombre);

    if (!existente) {
      this.patrocinadores.push(patrocinador);
    } else {
      existente.rubro = patrocinador.rubro;
      existente.carreras = patrocinador.carreras;
    }
    return true;
  }

  inscribirCorredor(corredor, carrera, numero) {
<<<<<<< HEAD
    if (this.inscripciones.some((i) => i.corredor === corredor && i.carrera === carrera)) {
      alert("Este corredor ya está inscripto a esta carrera.");
      return false;
    } else {
=======
    if (carrera.hayCupo() && corredor.tieneFichaVigente()) {
>>>>>>> 820d6f0ecc1f669db14672c2e0ce6405c4cb1704
      const inscripcion = new Inscripcion(corredor, carrera, numero);
      carrera.agregarInscripcion(inscripcion);
      this.inscripciones.push(inscripcion);
      return true;
    }
<<<<<<< HEAD
  }

=======
    return false;
  }
>>>>>>> 820d6f0ecc1f669db14672c2e0ce6405c4cb1704
  // agregar ToString()
}
