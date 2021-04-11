"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.sync = void 0;
var WSFCClientSocket_1 = __importDefault(require("./WSFCClientSocket"));
var rolling_1 = require("../utils/rolling");
var types_1 = require("../types");
var fs_1 = __importDefault(require("fs"));
var diff_1 = require("./diff");
var watch_1 = require("./watch");
var types_2 = require("../types");
var path_1 = __importDefault(require("path"));
var logger_1 = require("../utils/logger");
/**
 * Join paths client with prefix server path
 *
 * @param {string} serverPrefix The prefix server path
 * @param {string} clientPath The client path
 * @return {string} The path joined
 */
var joinPath = function (serverPrefix, clientPath) {
    return path_1["default"].join(serverPrefix, clientPath);
};
/**
 * Listen the connection error's socket
 * @param {net.Socket} socket The socket
 * @param {Function} userErrorCallback The callback to call when sync crash: (error) => {}
 * @param userErrorCallback
 */
var onConnectError = function (socket, userErrorCallback) {
    socket.on("error", function (error) {
        userErrorCallback('❌ Connection error: ' + error.message);
    });
};
/**
 * Set common actions
 *
 * @param {net.Socket} wsfcSocket The socket for listen data
 * @param {Function} userWatchCallback The callback to call when sync finish: (event, type) => {}
 * @param {Function} userErrorCallback The callback to call when sync crash: (error) => {}
 * @param {EventWatch} eventType The type of event
 * @param {string} pathChanged The path of file or directory changed
 */
var socketCommonHandlers = function (wsfcSocket, wSFCClientSocketInstance, userWatchCallback, userErrorCallback, eventType, pathChanged) {
    wsfcSocket.on("data", function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                res = JSON.parse(data.toString("utf-8"));
                //Show action executed
                logger_1.logger.info("The path: " + pathChanged + " arised: " + eventType);
                if (res.action == types_1.Action.CLOSE_CONNECTION) {
                    wSFCClientSocketInstance.closeConnection();
                    userWatchCallback(res.action_successful, pathChanged);
                    // If exist error call user error callback
                }
                else if (res.action == types_1.Action.ERROR) {
                    wSFCClientSocketInstance.closeConnection();
                    userErrorCallback(new Error(res.message));
                }
                return [2 /*return*/];
            });
        });
    });
};
/**
 * Set common handles sync
 *
 * @param {net.Socket} wsfcSocket The socket for listen data
 * @param {Function} userWatchCallback The callback to call when sync finish: (event, type) => {}
 * @param {Function} userErrorCallback The callback to call when sync crash: (error) => {}
 * @param {string} pathChanged The path of file or directory changed
 * @param {any} buffersChanged The buffer to change
 * @param {string} pathPrefix The path prefix of server's side
 * @param {string} folderToSync The path of only folder to sync
 */
var syncCommonHandlers = function (wsfcSocket, wSFCClientSocketInstance, userWatchCallback, userErrorCallback, pathChanged, buffersChanged, pathPrefix, folderToSync) {
    wsfcSocket.on("data", function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, bufferFile, req, req, req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = JSON.parse(data.toString());
                        if (!(res.action == types_1.Action.PREPARE_STREAM)) return [3 /*break*/, 5];
                        bufferFile = fs_1["default"].readFileSync(pathChanged);
                        if (!res.fileExist) return [3 /*break*/, 2];
                        return [4 /*yield*/, diff_1.getChanges(res.changesChunks, bufferFile)];
                    case 1:
                        // The chunks changed
                        buffersChanged = _a.sent();
                        req = {
                            action: types_1.Action.STREAM_START,
                            size: buffersChanged.length
                        };
                        wsfcSocket.write(JSON.stringify(req));
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, diff_1.getAllChunks(bufferFile)];
                    case 3:
                        buffersChanged = _a.sent();
                        req = {
                            action: types_1.Action.STREAM_START,
                            size: buffersChanged.length
                        };
                        wsfcSocket.write(JSON.stringify(req));
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (res.action == types_1.Action.STREAM_BUFFERS) {
                            req = {
                                action: types_1.Action.STREAM_BUFFERS,
                                start: buffersChanged[res.index].start,
                                buffer64: buffersChanged[res.index].buffer64,
                                index: res.index,
                                path: joinPath(pathPrefix, folderToSync).replace(/\\/g, '/')
                            };
                            wsfcSocket.write(JSON.stringify(req));
                            // close connection and call user callback
                        }
                        else if (res.action == types_1.Action.CLOSE_CONNECTION) {
                            wSFCClientSocketInstance.closeConnection();
                            // when finish call user callback
                            userWatchCallback(res.action_successful, pathChanged);
                            // If exist error call user error callback
                        }
                        else if (res.action == types_1.Action.ERROR) {
                            wSFCClientSocketInstance.closeConnection();
                            // when finish call user callback
                            userErrorCallback(new Error(res.message));
                        }
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    });
};
/**
 * Sync the file client with backup files when there are changes
 *
 * @param {string} pathToWatch The path to watch
 * @param {Function} userWatchCallback The callback to call when sync is executed.: (event, type) => {}
 * @param {Function} userErrorCallback The callback to call when sync is crashed.: (error) => {}
 * @param {number} [port=9000] The server port, default 9000
 * @param {string} [host="localhost"] The server host, default localhost
 * @param {string} pathPrefix The prefix path, default empty
 * @return {FSWatcher} The FSwatcher instance
 */
var sync = function (pathToWatch, userWatchCallback, userErrorCallback, pathPrefix, port, host) {
    if (pathPrefix === void 0) { pathPrefix = ''; }
    if (port === void 0) { port = 9000; }
    if (host === void 0) { host = "localhost"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var watcher;
        return __generator(this, function (_a) {
            watcher = watch_1.watch(pathToWatch, function (eventType, pathChanged) { return __awaiter(void 0, void 0, void 0, function () {
                var folderToSync, wSFCClientSocketInstance, wsfcSocket, fileClient, rollingHashes, buffersChanged, req, wSFCClientSocketInstance, wsfcSocket, req, wSFCClientSocketInstance, wsfcSocket, req, wSFCClientSocketInstance, wsfcSocket, req, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            folderToSync = pathChanged.replace(pathToWatch, '');
                            if (!(eventType === types_2.EventWatch.SYNC)) return [3 /*break*/, 2];
                            wSFCClientSocketInstance = new WSFCClientSocket_1["default"]();
                            wsfcSocket = wSFCClientSocketInstance.getConnect(port, host);
                            onConnectError(wsfcSocket, userErrorCallback);
                            fileClient = fs_1["default"].readFileSync(pathChanged);
                            return [4 /*yield*/, rolling_1.getRollingHashes(pathChanged)];
                        case 1:
                            rollingHashes = _a.sent();
                            buffersChanged = null;
                            req = JSON.stringify({
                                rollingHashes: rollingHashes,
                                action: types_1.Action.COMPARE_ROLLINGS,
                                path: joinPath(pathPrefix, folderToSync).replace(/\\/g, '/'),
                                fileSize: fileClient.length
                            });
                            // make first request to server
                            wsfcSocket.write(req);
                            // listen response from server and make new requests
                            syncCommonHandlers(wsfcSocket, wSFCClientSocketInstance, userWatchCallback, userErrorCallback, pathChanged, buffersChanged, pathPrefix, folderToSync);
                            return [3 /*break*/, 3];
                        case 2:
                            if (eventType === types_2.EventWatch.REMOVE_FILE) {
                                wSFCClientSocketInstance = new WSFCClientSocket_1["default"]();
                                wsfcSocket = wSFCClientSocketInstance.getConnect(port, host);
                                onConnectError(wsfcSocket, userErrorCallback);
                                req = JSON.stringify({
                                    action: types_1.Action.REMOVE_FILE,
                                    path: joinPath(pathPrefix, folderToSync).replace(/\\/g, '/')
                                });
                                wsfcSocket.write(req);
                                // common hanlders for current socket data
                                socketCommonHandlers(wsfcSocket, wSFCClientSocketInstance, userWatchCallback, userErrorCallback, eventType, pathChanged);
                            }
                            // if remove a directory
                            else if (eventType === types_2.EventWatch.REMOVE_DIR) {
                                wSFCClientSocketInstance = new WSFCClientSocket_1["default"]();
                                wsfcSocket = wSFCClientSocketInstance.getConnect(port, host);
                                onConnectError(wsfcSocket, userErrorCallback);
                                req = JSON.stringify({
                                    action: types_1.Action.REMOVE_DIR,
                                    path: joinPath(pathPrefix, folderToSync).replace(/\\/g, '/')
                                });
                                wsfcSocket.write(req);
                                // common hanlders for current socket data
                                socketCommonHandlers(wsfcSocket, wSFCClientSocketInstance, userWatchCallback, userErrorCallback, eventType, pathChanged);
                            }
                            // if add directory
                            else if (eventType === types_2.EventWatch.ADD_DIR) {
                                wSFCClientSocketInstance = new WSFCClientSocket_1["default"]();
                                wsfcSocket = wSFCClientSocketInstance.getConnect(port, host);
                                onConnectError(wsfcSocket, userErrorCallback);
                                req = JSON.stringify({
                                    action: types_1.Action.ADD_DIR,
                                    path: joinPath(pathPrefix, folderToSync).replace(/\\/g, '/')
                                });
                                wsfcSocket.write(req);
                                // common hanlders for current socket data
                                socketCommonHandlers(wsfcSocket, wSFCClientSocketInstance, userWatchCallback, userErrorCallback, eventType, pathChanged);
                            }
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            // when exist error call user error callback
                            userErrorCallback(error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/, watcher];
        });
    });
};
exports.sync = sync;
