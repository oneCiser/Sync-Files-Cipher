"use strict";
exports.__esModule = true;
exports.sync = exports.createServer = void 0;
var server_1 = require("./src/server");
exports.createServer = server_1.createServer;
var client_1 = require("./src/client");
exports.sync = client_1.sync;
