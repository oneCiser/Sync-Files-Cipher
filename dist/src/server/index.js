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
exports.createServer = void 0;
var net_1 = __importDefault(require("net"));
var fs_1 = __importDefault(require("fs"));
var types_1 = require("../types");
var rolling_1 = require("../utils/rolling");
var diff_1 = require("./diff");
var encrypt_1 = require("../utils/encrypt");
/**
 * Create a socket server
 *
 * @param {() => void} onLIstenCallback The callback when server is listening
 * @param {number} [port=9000] The port, default 9000
 * @return {net.Server}  The server as instance of net.Server
 */
var createServer = function (onLIstenCallback, port) {
    if (port === void 0) { port = 9000; }
    var SERVER = net_1["default"].createServer(function (socket) {
        // contains the chunks changed
        var buffersChanged = {};
        // the size of chunks changed
        var buffersChangedSize = 0;
        // the sise from client file
        var fileClientSize = 0;
        // receive data from client
        socket.on("data", function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var req, serverRolling, changesChunks, res, res, res, res, res, res, res, res, res, error_1, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 15, , 16]);
                            req = JSON.parse(data.toString());
                            if (!(req.action == types_1.Action.COMPARE_ROLLINGS)) return [3 /*break*/, 3];
                            fileClientSize = req.fileSize;
                            return [4 /*yield*/, rolling_1.getRollingHashes(req.path)];
                        case 1:
                            serverRolling = _a.sent();
                            return [4 /*yield*/, rolling_1.compareRolling(req.rollingHashes, serverRolling)];
                        case 2:
                            changesChunks = _a.sent();
                            res = {
                                action: types_1.Action.PREPARE_STREAM,
                                changesChunks: changesChunks
                            };
                            socket.write(JSON.stringify(res));
                            return [3 /*break*/, 14];
                        case 3:
                            if (!(req.action == types_1.Action.STREAM_START)) return [3 /*break*/, 4];
                            if (req.size == 0) { // not have changes
                                res = {
                                    action: types_1.Action.CLOSE_CONNECTION
                                };
                                socket.write(JSON.stringify(res));
                            }
                            else { // Ask for the first chunk changed
                                buffersChangedSize = req.size;
                                res = {
                                    action: types_1.Action.STREAM_BUFFERS,
                                    index: 0
                                };
                                socket.write(JSON.stringify(res));
                            }
                            return [3 /*break*/, 14];
                        case 4:
                            if (!(req.action == types_1.Action.STREAM_BUFFERS)) return [3 /*break*/, 8];
                            if (!(req.index < buffersChangedSize - 1)) return [3 /*break*/, 5];
                            res = {
                                index: req.index + 1,
                                action: types_1.Action.STREAM_BUFFERS
                            };
                            buffersChanged[req.start] = req.buffer64;
                            socket.write(JSON.stringify(res));
                            return [3 /*break*/, 7];
                        case 5:
                            buffersChanged[req.start] = req.buffer64;
                            res = {
                                action: types_1.Action.CLOSE_CONNECTION
                            };
                            return [4 /*yield*/, diff_1.syncFile(buffersChanged, req.path, fileClientSize)];
                        case 6:
                            _a.sent();
                            socket.write(JSON.stringify(res));
                            _a.label = 7;
                        case 7: return [3 /*break*/, 14];
                        case 8:
                            if (!(req.action == types_1.Action.REMOVE_FILE)) return [3 /*break*/, 9];
                            // Remove file
                            if (fs_1["default"].existsSync(req.path)) {
                                fs_1["default"].unlinkSync(req.path);
                            }
                            res = {
                                action: types_1.Action.CLOSE_CONNECTION
                            };
                            socket.write(JSON.stringify(res));
                            return [3 /*break*/, 14];
                        case 9:
                            if (!(req.action == types_1.Action.REMOVE_DIR)) return [3 /*break*/, 10];
                            // Remove dir
                            fs_1["default"].rmdirSync(req.path, { recursive: true });
                            res = {
                                action: types_1.Action.CLOSE_CONNECTION
                            };
                            socket.write(JSON.stringify(res));
                            return [3 /*break*/, 14];
                        case 10:
                            if (!(req.action == types_1.Action.ADD_FILE)) return [3 /*break*/, 12];
                            // Encryp and save file
                            return [4 /*yield*/, encrypt_1.encryptAndSaveFile(Buffer.from(req.file, 'base64'), req.path)];
                        case 11:
                            // Encryp and save file
                            _a.sent();
                            res = {
                                action: types_1.Action.CLOSE_CONNECTION
                            };
                            socket.write(JSON.stringify(res));
                            return [3 /*break*/, 14];
                        case 12:
                            if (!(req.action == types_1.Action.ADD_DIR)) return [3 /*break*/, 14];
                            // Save dir
                            return [4 /*yield*/, fs_1["default"].mkdirSync(req.path, { recursive: true })];
                        case 13:
                            // Save dir
                            _a.sent();
                            res = {
                                action: types_1.Action.CLOSE_CONNECTION
                            };
                            socket.write(JSON.stringify(res));
                            _a.label = 14;
                        case 14: return [3 /*break*/, 16];
                        case 15:
                            error_1 = _a.sent();
                            console.log("** Server error **");
                            res = {
                                action: types_1.Action.ERROR,
                                message: error_1.message
                            };
                            socket.write(JSON.stringify(res));
                            return [3 /*break*/, 16];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        });
    });
    // listen and call user callback
    SERVER.listen(port, function () {
        if (onLIstenCallback)
            onLIstenCallback();
    });
    return SERVER;
};
exports.createServer = createServer;
