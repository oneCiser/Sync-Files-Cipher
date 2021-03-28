"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var net_1 = __importDefault(require("net"));
var WSFCClientSocket = /** @class */ (function () {
    function WSFCClientSocket() {
    }
    WSFCClientSocket.handles = function () {
        // connect event 
        this.socket.on('connect', function () {
            console.log("Connect with socket sussfull");
        });
        this.socket.on('error', function (error) {
            console.log("Conection error: ", error);
        });
    };
    WSFCClientSocket.getConnect = function (port, host) {
        this.createSocket();
        this.socket.connect(port, host);
        this.handles();
        return this.getSocket();
    };
    WSFCClientSocket.createSocket = function () {
        // creat a soccket
        if (!this.socket)
            this.socket = new net_1["default"].Socket();
    };
    WSFCClientSocket.getSocket = function () {
        return this.socket;
    };
    WSFCClientSocket.closeConnection = function () {
        if (this.socket) {
            this.socket.removeAllListeners('error');
            this.socket.destroy();
        }
        else {
            throw new Error("Socket not exist");
        }
    };
    return WSFCClientSocket;
}());
exports["default"] = WSFCClientSocket;
