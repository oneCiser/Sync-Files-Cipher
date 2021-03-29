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
exports.compareRolling = exports.getRollingHashes = exports.createRollingHashs = void 0;
var crypto_1 = require("crypto");
var fs_1 = __importDefault(require("fs"));
/**
 * Create an arrasy of hash for each chunk of buffer
 * @param {Buffer} buffer The buffer to create rolling hashes
 * @param {number} [chunkSize=3072]  The size of chunk, default 3072 bytes
 * @return {Array} Array of hashes from each chunk
 */
var createRollingHashs = function (buffer, chunkSize) {
    if (chunkSize === void 0) { chunkSize = 3072; }
    return __awaiter(void 0, void 0, void 0, function () {
        var hashes, i, start, end, hashed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hashes = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < Math.ceil(buffer.length / chunkSize))) return [3 /*break*/, 4];
                    start = i * chunkSize;
                    end = (i + 1) * chunkSize;
                    if (end >= buffer.length)
                        end = buffer.length;
                    return [4 /*yield*/, crypto_1.createHash('sha256').update(buffer.slice(start, end), "utf-8").digest('hex')];
                case 2:
                    hashed = _a.sent();
                    hashes.push(hashed);
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, hashes];
            }
        });
    });
};
exports.createRollingHashs = createRollingHashs;
/**
 * Create array of hashes from file path
 * @param path Path of file
 * @returns {Array} Array of hashes from each chunk
 */
var getRollingHashes = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var buffer, clienteRollingHashes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                buffer = fs_1["default"].readFileSync(path);
                return [4 /*yield*/, exports.createRollingHashs(buffer)];
            case 1:
                clienteRollingHashes = _a.sent();
                return [2 /*return*/, clienteRollingHashes];
        }
    });
}); };
exports.getRollingHashes = getRollingHashes;
/**
 * Compare rollings of file client and file server
 * @param {Array} clientRolling Array of hashes from file client
 * @param {Array} serverRolling Array of hashes from file server
 * @param {number} [chunkSize=3072] The size of chunk,  default 3072 bytes
 * @return {Array}  Array of object of hashes differents with your range of byte
 */
var compareRolling = function (clientRolling, serverRolling, chunkSize) {
    if (chunkSize === void 0) { chunkSize = 3072; }
    var match = [];
    for (var i = 0; i < clientRolling.length; i++) {
        if (!serverRolling[i] || clientRolling[i] != serverRolling[i]) {
            match.push({
                hash: clientRolling[i],
                start: i * chunkSize,
                end: (i + 1) * chunkSize
            });
        }
    }
    return match;
};
exports.compareRolling = compareRolling;
