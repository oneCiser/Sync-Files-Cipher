"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var net_1 = __importDefault(require("net"));
/**
 * Class for managament client connection
 * @export
 * @class WSFCClientSocket
 */
var WSFCClientSocket = /** @class */ (function () {
    /**
     * Singleton.
     * @memberof WSFCClientSocket
     */
    function WSFCClientSocket() {
    }
    /**
     * Set handles error and connect event
     *
     * @private
     * @static
     * @memberof WSFCClientSocket
     */
    WSFCClientSocket.handles = function () {
        this.socket.on("connect", function () {
            console.log("Connect with socket sussfull");
        });
        this.socket.on("error", function (error) {
            console.log("Conection error: ", error);
        });
    };
    /**
     * Create a connect
     *
     * @static
     * @param {number} port The server port
     * @param {string} host The server host
     * @return {net.Socket} The new socket
     * @memberof WSFCClientSocket
     */
    WSFCClientSocket.getConnect = function (port, host) {
        this.createSocket();
        this.socket.connect(port, host);
        this.handles();
        return this.getSocket();
    };
    /**
     * Create a new socket
     *
     * @private
     * @static
     * @memberof WSFCClientSocket
     */
    WSFCClientSocket.createSocket = function () {
        // create a soccket
        if (!this.socket)
            this.socket = new net_1["default"].Socket();
    };
    /**
     *  Return exist socket
     *
     * @static
     * @return net.Socket
     * @memberof WSFCClientSocket
     */
    WSFCClientSocket.getSocket = function () {
        return this.socket;
    };
    /**
     * Close connection
     *
     * @static
     * @memberof WSFCClientSocket
     */
    WSFCClientSocket.closeConnection = function () {
        if (this.socket) {
            this.socket.removeAllListeners("error");
            this.socket.destroy();
            this.socket = null;
            console.log("Connection close");
        }
        else {
            throw new Error("Socket not exist");
        }
    };
    return WSFCClientSocket;
}());
exports["default"] = WSFCClientSocket;
