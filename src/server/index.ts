import net from 'net'

const PORT = process.argv[3] || '9000'


// create a server
const SERVER = net.createServer( function (socket) {
    console.log("New connection");
    socket.write("Server hands chake")

    // echo
    socket.on('data', function (data) {
        socket.write(data)
    })
})

// listen
SERVER.listen(parseInt(PORT), () => {
    console.log("Socket on port:", PORT);
})