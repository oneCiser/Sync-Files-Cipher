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
var sync = function (clientePath, port, host) {
    if (port === void 0) { port = 9000; }
    if (host === void 0) { host = 'localhost'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var wsfcSocket, fileClient, rollingHashes, buffersChanged, req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wsfcSocket = WSFCClientSocket_1["default"].getConnect(port, host);
                    fileClient = fs_1["default"].readFileSync(clientePath);
                    return [4 /*yield*/, rolling_1.getRollingHashes(clientePath)];
                case 1:
                    rollingHashes = _a.sent();
                    buffersChanged = null;
                    req = JSON.stringify({
                        rollingHashes: rollingHashes,
                        action: types_1.Action.COMPARE_ROLLINGS,
                        path: clientePath,
                        fileSize: fileClient.length
                    });
                    wsfcSocket.write(req);
                    wsfcSocket.on('data', function (data) {
                        return __awaiter(this, void 0, void 0, function () {
                            var res, bufferFile, req_1, req_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        res = JSON.parse(data.toString('utf-8'));
                                        if (!(res.action == types_1.Action.PREPARE_STREAM)) return [3 /*break*/, 2];
                                        console.log('PREPARE_STREAM');
                                        bufferFile = fs_1["default"].readFileSync(clientePath);
                                        return [4 /*yield*/, diff_1.getChanges(res.changesChunks, bufferFile)];
                                    case 1:
                                        buffersChanged = _a.sent();
                                        req_1 = {
                                            action: types_1.Action.STREAM_START,
                                            size: buffersChanged.length
                                        };
                                        wsfcSocket.write(JSON.stringify(req_1));
                                        return [3 /*break*/, 3];
                                    case 2:
                                        if (res.action == types_1.Action.CLOSE_CONNECTION) {
                                            console.log('CLOSE_CONNECTION');
                                            console.log('Archivo sincronizado');
                                            WSFCClientSocket_1["default"].closeConnection();
                                            // (async () => {
                                            //     const decryptedFile = await decryptFile('./tmp/Cifrados/backup.png');
                                            //     console.log(decryptedFile);
                                            //     fs.writeFileSync('./tmp/res-client.png', Buffer.from(decryptedFile));
                                            // })()
                                        }
                                        else if (res.action == types_1.Action.STREAM_BUFFERS) {
                                            console.log('STREAM_BUFFERS');
                                            req_2 = {
                                                action: types_1.Action.STREAM_BUFFERS,
                                                start: buffersChanged[res.index].start,
                                                buffer64: buffersChanged[res.index].buffer64,
                                                index: res.index
                                            };
                                            wsfcSocket.write(JSON.stringify(req_2));
                                        }
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
};
exports.sync = sync;
