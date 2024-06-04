/*
* Autor: Nicolas Gil Vergara
* Fecha: 14/05/2024
* Descripcion:  Archivos para acceder a los datos de
*               cursos de programación ofrecidos
*               por una empresa virtual de enseñanza.
*/

//Importar módulo 'express'
const express = require('express');

//Importar los datos asociados a programación
const {Matemáticas} = require('../modelo/cursos.js').infoCursos;

//Definir ruta para el servidor
const rutaCursosMatematicas = express.Router();

//Se define el middleware para recepción y manipulación de datos
rutaCursosMatematicas.use(express.json());

//Crear las rutas para el servidor
rutaCursosMatematicas.get('/', (req, res) => {
    return res.json(Matemáticas);
})

rutaCursosMatematicas.get('/id/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let indice = Matemáticas.findIndex(curso => curso.id == id);
    
    if (indice >= 0 ){
        return res.json(Matemáticas[indice]);
    }else{
        return res.status(204).send(`El elemento con indice ${indice} no se encuentra.`);
    }
})

rutaCursosMatematicas.get('/tema/:tema', (req, res) => {
    let tema = req.params.tema;
    let resultados = Matemáticas.filter(curso => curso.tema.toLowerCase() == tema.toLowerCase());

    console.log(resultados);
    
    if (resultados.length == 0){
        return res.status(404).send(`El curso del lenguaje ${tema} no se encuentra.`);
    }

    if(req.query.ordenar === 'vistas'){
        resultados.sort((a,b) => {
            return b.vistas - a.vistas;
        })
    }

    return res.json(resultados);
})

//POST
rutaCursosMatematicas.post('/', (req, res) => {
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



//PUT
rutaCursosMatematicas.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const cursoActualizado = req.body;
    
    const indice = Matemáticas.findIndex(curso => curso.id == id)

    if(indice >= 0){
        Matemáticas[indice] = cursoActualizado;
    }

    return res.json(Matemáticas);
})

//PATCH
rutaCursosMatematicas.patch('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const infoActualizada = req.body;

    const indice = Matemáticas.findIndex(curso => curso.id == id);

    if(indice >= 0){
        const cursoAModificar = Matemáticas[indice];

        Object.assign(cursoAModificar, infoActualizada);
    }
    return res.json(Matemáticas);
})

//DELETE
rutaCursosMatematicas.delete('/:id', (req, res) => {
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

module.exports = rutaCursosMatematicas;