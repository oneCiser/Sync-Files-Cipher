"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var net_1 = __importDefault(require("net"));
// get arguments
var PORT = process.argv[3] || '9000';
var HOST = process.argv[2] || 'localhost';
// creat a soccket
var socket = new net_1["default"].Socket();
// connect event 
socket.on('connect', function () {
    console.log("Connect with socket sussfull");
    socket.write("Hola server");
});
socket.on('error', function (error) {
    console.log("Conection error: ", error);
});
socket.on('data', function (data) {
    console.log(data.toString("utf-8"));
});
// connect socket
socket.connect(parseInt(PORT), HOST);
