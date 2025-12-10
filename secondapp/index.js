// npm install express

var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {

    r ={
      'message':'Mensajito'
    };

    response.json(r);
});

/*
Calling this service sending payload as parameters in URL: 
http://localhost:3000/serv001?id=Nope&token=2345678dhuj43567fgh&geo=123456789&jedi=obiwan&sable=azul
*/
app.get("/serv001", async function (req, res) {
    const user_id = req.query.id;
    const token = req.query.token;
    const geo = req.query.geo;
	const jedi= req.query.jedi;
	const sable=req.query.sable;

    r ={
      'user_id': user_id,
      'token': token,
      'geo': geo,
	  'jedi': jedi,
	  'sable' : sable
    };

    res.json(r);
});

app.listen(3000, function() {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});
