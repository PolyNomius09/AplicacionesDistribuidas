var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); 
const { SerialPort } = require('serialport');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});

const sp = new SerialPort({
    path: 'COM4',
    baudRate: 9600,
})

io.on('connection', function(socket){
    console.log("Nueva Conexión por sockets");
    var connectedUsersCount = io.engine.clientsCount;
    console.log("Numero de users: " + connectedUsersCount);

    sp.on('data', function(data) {
        console.log('Received: ' + data);
        socket.emit('llegaDeSerial', {text: data.toString('utf8') });
    });
});
