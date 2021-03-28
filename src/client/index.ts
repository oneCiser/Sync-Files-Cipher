import net from 'net'

// get arguments
const PORT = process.argv[3] || '9000'
const HOST = process.argv[2] || 'localhost'

// creat a soccket
const socket = new net.Socket();

// connect event 
socket.on('connect', function () {
    console.log("Connect with socket sussfull");
    socket.write("Hola server")
})

socket.on('error', function (error){
    console.log("Conection error: ", error);
} )

socket.on('data', function (data) {
    console.log(data.toString("utf-8"));
})

// connect socket
socket.connect(parseInt(PORT), HOST);