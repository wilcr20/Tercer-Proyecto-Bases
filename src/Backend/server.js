const http = require('http');
const { Client } = require('pg')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var ctrl = require('./controladores'); // llama los controladores


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
    next();
});


// Utilizar PUT si se envian datos en la consulta como JSON
// Usar GEt si solo se desae conseguir datos de petición , sin envio de los mismos

app.put('/conectar', ctrl.conectarServer);

app.get('/obtenerTablas', ctrl.obtenerTablas);

app.put('/obtenerTablaMapa', ctrl.obtenerTablaMapa);

app.put('/crearUsuario', ctrl.crearUsuario);


// app.put('/conectarNodo', ctrl.conectarNodo);

// app.put('/obtenerSchemas', ctrl.obtenerSchema);

// app.put('/obtenerPrivilegiosTablas', ctrl.obtenerPrivilegiosTablas);

// app.put('/obtenerPrivilegiosColumnas', ctrl.obtenerPrivilegiosColumnas);

// app.put('/enviarQuery', ctrl.enviarQuery);

// app.put('/enviarQueryDistrib', ctrl.enviarQueryDistrib);

app.get('/', function(req, res) {
    res.send('Servidor de NodeJs para proyecto Bases de datos II!');
});

app.listen(3000, function() {
    console.log('Servidor corriendo en puerto 3000!! ;v');
});