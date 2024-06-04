/*
* Autor: Nicolas Gil Vergara
* Fecha: 14/05/2024
* Descripcion:  Api para acceder a los datos de cursos 
*               ofrecidos por una empresa virtual   
*               de enseñanza
*/
//Importar módulo 'express'
const express = require('express');

//Definición del puerto
const PUERTO = process.env.PORT || 3000;

//Instancia de cors
const cors = require('cors');

//Ruta de cursos de programación
const rutaCursosProgramacion = require('./rutas/programacion.js');

//Ruta de cursos de matemáticas
const rutaCursosMatematicas = require('./rutas/matematicas.js');

//Importación de datos principales
const infoCursos = require('./modelo/cursos.js');

const os = require('os')

//Servidor
const servidorCursosNGV = express();

servidorCursosNGV.use(cors({ origin: 'http://localhost:8080' }));

//Creación de la ruta para los cursos de programación
servidorCursosNGV.use('/api/cursos/programacion', rutaCursosProgramacion);

//Creación de la ruta para los cursos de matemáticas
servidorCursosNGV.use('/api/cursos/matematicas', rutaCursosMatematicas);

//Rutas Principales
servidorCursosNGV.get('/', (req, res) => {
    return res.send("¡Bienvenido a la API de cursos online!")
})

servidorCursosNGV.get('/api/equipo', (req, res) => {
    res.json({ equipo: os.hostname() });
  });

servidorCursosNGV.get('/cursos', (req, res) => {
    return res.json(infoCursos)
})

servidorCursosNGV.listen(PUERTO, () => {
    console.log(`http://localhost:${PUERTO}`);
})