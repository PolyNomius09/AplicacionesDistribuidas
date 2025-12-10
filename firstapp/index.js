// npm install express

var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

//se comentan las lineas
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {

    r ={
      'message':'There is no try, just do it'
    };

    response.json(r);
});

app.listen(3000, function() {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});
