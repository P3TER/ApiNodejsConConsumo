const express = require('express');
const fs = require('fs');
const path = require('path');

const rutaCursosProgramacion = express.Router();
rutaCursosProgramacion.use(express.json());

const cursosPath = path.join(__dirname, '../modelo/cursos.js');

// Leer los datos del archivo
function readCursos() {
    delete require.cache[require.resolve('../modelo/cursos.js')];
    return require('../modelo/cursos.js').infoCursos.Programacion;
}

// Escribir los datos en el archivo
function writeCursos(cursos) {
    const infoCursos = {
        Programacion: cursos,
        Matemáticas: require('../modelo/cursos.js').infoCursos.Matemáticas
    };
    fs.writeFileSync(cursosPath, `const infoCursos = ${JSON.stringify(infoCursos, null, 4)};\n\nmodule.exports = { infoCursos };`);
}

// Rutas
rutaCursosProgramacion.get('/', (req, res) => {
    return res.json(readCursos());
});

rutaCursosProgramacion.get('/id/:id', (req, res) => {
    const cursos = readCursos();
    let id = parseInt(req.params.id);
    let indice = cursos.findIndex(curso => curso.id == id);
    
    if (indice >= 0) {
        return res.json(cursos[indice]);
    } else {
        return res.status(404).send(`El curso con id ${id} no se encuentra.`);
    }
}); 

rutaCursosProgramacion.post('/', (req, res) => {
    const nuevoCurso = req.body;
    const cursos = readCursos();

    // Generar un nuevo ID para el curso
    const maxId = cursos.length > 0 ? Math.max(...cursos.map(curso => curso.id)) : 0;
    nuevoCurso.id = maxId + 1;

    // Agregar el nuevo curso a la lista de cursos y escribir en el archivo
    cursos.push(nuevoCurso);
    writeCursos(cursos);

    // Devolver la lista actualizada de cursos
    return res.json(cursos);
});



rutaCursosProgramacion.put('/:id', (req, res) => {
    const cursos = readCursos();
    const id = parseInt(req.params.id);
    const cursoActualizado = req.body;
    
    const indice = cursos.findIndex(curso => curso.id == id);
    if (indice >= 0) {
        cursos[indice] = cursoActualizado;
        writeCursos(cursos);
        return res.json(cursos[indice]);
    } else {
        return res.status(404).send(`El curso con id ${id} no se encuentra.`);
    }
});

rutaCursosProgramacion.patch('/:id', (req, res) => {
    const cursos = readCursos();
    const id = parseInt(req.params.id);
    const infoActualizada = req.body;

    const indice = cursos.findIndex(curso => curso.id == id);

    if (indice >= 0) {
        const cursoAModificar = cursos[indice];
        Object.assign(cursoAModificar, infoActualizada);
        writeCursos(cursos);
        return res.json(cursoAModificar);
    } else {
        return res.status(404).send(`El curso con id ${id} no se encuentra.`);
    }
});

// rutaCursosProgramacion.delete('/:id', (req, res) => {
//     const cursos = readCursos();
//     const id = parseInt(req.params.id);
//     const indice = cursos.findIndex(curso => curso.id == id);

//     if (indice >= 0) {
//         cursos.splice(indice, 1);
//         writeCursos(cursos);
//         return res.status(204).send();
//     } else {
//         return res.status(404).send(`El curso con id ${id} no se encuentra.`);
//     }
// });

rutaCursosProgramacion.delete('/:id', (req, res) => {
    const cursos = readCursos();
    const id = parseInt(req.params.id);
    const indice = cursos.findIndex(curso => curso.id == id);

    if (indice >= 0) {
        cursos[indice].estado = false; // Cambia el estado a false en lugar de eliminar
        writeCursos(cursos);
        return res.status(204).send();
    } else {
        return res.status(404).send(`El curso con id ${id} no se encuentra.`);
    }
});

module.exports = rutaCursosProgramacion;
