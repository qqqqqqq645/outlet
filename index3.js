//var app = require('express')();
var http = require('http').createServer(handler);
var io = require('socket.io')(http);
var fs = require('fs');
var gpio = require('onoff').Gpio;
const LED = new gpio(23,'out');
function handler(req, res) {
    fs.readFile(__dirname + '/index2.html', (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Fount");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}


http.listen(3000, () => {
    console.log('listening on *: 3000');
});

io.on('connection', (socket) => {
    var swvalue = 0;
    socket.emit('sw1',LED.readSync());
    socket.on('sw1',(data) =>{
        swvalue = data;
        if(swvalue != LED.readSync()){
            LED.writeSync(swvalue);
        }
    });
});

process.on('SIGINT', function () { //on ctrl+c
    LED.writeSync(0); // Turn LED off
    LED.unexport(); // Unexport LED GPIO to free resources
    process.exit(); //exit completely
  });
