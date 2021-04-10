"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var net_1 = __importDefault(require("net"));
var logger_1 = require("../utils/logger");
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
     *
     * @memberof WSFCClientSocket
     */
    WSFCClientSocket.prototype.handles = function () {
        this.socket.on("connect", function () {
        });
    };
    /**
     * Create a connect
     *
     *
     * @param {number} port The server port
     * @param {string} host The server host
     * @return {net.Socket} The new socket
     * @memberof WSFCClientSocket
     */
    WSFCClientSocket.prototype.getConnect = function (port, host) {
        this.createSocket();
        this.socket.connect(port, host);
        this.handles();
        return this.getSocket();
    };
    /**
     * Create a new socket
     *
     * @private
     *
     * @memberof WSFCClientSocket
     */
    WSFCClientSocket.prototype.createSocket = function () {
        // create a soccket
        this.socket = new net_1["default"].Socket();
    };
    /**
     *  Return exist socket
     *
     *
     * @return net.Socket
     * @memberof WSFCClientSocket
     */
    WSFCClientSocket.prototype.getSocket = function () {
        return this.socket;
    };
    /**
     * Close connection
     *
     *
     * @memberof WSFCClientSocket
     */
    WSFCClientSocket.prototype.closeConnection = function () {
        if (this.socket) {
            this.socket.removeAllListeners("error");
            this.socket.destroy();
            this.socket = null;
            logger_1.logger.info("Connection close");
        }
        else {
            throw new Error("Socket not exist");
        }
    };
    return WSFCClientSocket;
}());
exports["default"] = WSFCClientSocket;
