"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var net_1 = __importDefault(require("net"));
var PORT = process.argv[3] || '9000';
// create a server
var SERVER = net_1["default"].createServer(function (socket) {
    console.log("New connection");
    socket.write("Server hands chake");
    // echo
    socket.on('data', function (data) {
        socket.write(data);
    });
});
// listen
SERVER.listen(parseInt(PORT), function () {
    console.log("Socket on port:", PORT);
});
