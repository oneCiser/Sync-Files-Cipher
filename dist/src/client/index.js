"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.sync = void 0;
var WSFCClientSocket_1 = __importDefault(require("./WSFCClientSocket"));
var Rolling_1 = require("./Rolling");
var sync = function (clientePath, port, host) {
    if (port === void 0) { port = 9000; }
    if (host === void 0) { host = 'localhost'; }
    var wsfcSocket = WSFCClientSocket_1["default"].getConnect(port, host);
    var clienteRollingHashes = Rolling_1.createClienteRollingHashes(clientePath);
    var wraper = JSON.stringify({ clienteRollingHashes: clienteRollingHashes, action: 'compareRollings' });
    wsfcSocket.write(wraper);
    wsfcSocket.on('data', function (data) {
        console.log(data.toString('utf-8'));
    });
};
exports.sync = sync;
