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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.decryptFile = exports.decryptBuffer = exports.encryptBuffer = exports.decryptFilesByChunks = exports.encryptAndSaveChunk = exports.encryptAndSaveFile = void 0;
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var ALGORITHM = "aes-256-cbc";
/**
 * Encrypt and save a file
 *
 * @param {Buffer} file The file to encrypt
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {String} path The path of file
 * @return {Buffer}  The buffer encrypted
 */
var encryptAndSaveFile = function (file, path, key, iv) { return __awaiter(void 0, void 0, void 0, function () {
    var cipher, encrypted;
    return __generator(this, function (_a) {
        cipher = crypto_1["default"].createCipheriv(ALGORITHM, Buffer.from(key, "base64"), Buffer.from(iv, "base64"));
        encrypted = cipher.update(file);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        fs_1["default"].writeFileSync(path, encrypted);
        return [2 /*return*/, encrypted];
    });
}); };
exports.encryptAndSaveFile = encryptAndSaveFile;
/**
 * Encrypt and save a file by chunks
 * @param {Buffer} file The file to encrypt
 * @param {String} path The path of file
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {number} [chunksize=3072] The size of chunks
 */
var encryptAndSaveChunk = function (file, path, key, iv, chunksize) {
    if (chunksize === void 0) { chunksize = 3072; }
    var chunks = Math.ceil(file.length / chunksize);
    fs_1["default"].open(path, "w+", function (err, fd) {
        return __awaiter(this, void 0, void 0, function () {
            var index, start, end, chunkBufferCipher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < chunks)) return [3 /*break*/, 4];
                        start = index * chunksize;
                        end = (index + 1) * chunksize;
                        if (end >= file.length)
                            end = file.length;
                        return [4 /*yield*/, exports.encryptBuffer(file.slice(start, end), key, iv)];
                    case 2:
                        chunkBufferCipher = _a.sent();
                        fs_1["default"].writeSync(fd, chunkBufferCipher, 0, chunkBufferCipher.length, start);
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
};
exports.encryptAndSaveChunk = encryptAndSaveChunk;
/**
 * Decrypt file by chunks
 * @param {String} path The path of file
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {number} [chunksize=3072] The size of chunks
 * @return {Promise<Array<Buffer>>} The buffer of chunks decrypted
 */
var decryptFilesByChunks = function (path, key, iv, chunksize) {
    if (chunksize === void 0) { chunksize = 3072; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fullBufferEncrypt, chunks, decryptedBuffer, index, start, end, chunkBufferDecrypted;
        return __generator(this, function (_a) {
            fullBufferEncrypt = fs_1["default"].readFileSync(path);
            chunks = Math.ceil(fullBufferEncrypt.length / chunksize);
            decryptedBuffer = [];
            for (index = 0; index < chunks; index++) {
                start = index * chunksize;
                end = (index + 1) * chunksize;
                if (end >= fullBufferEncrypt.length)
                    end = fullBufferEncrypt.length;
                chunkBufferDecrypted = exports.decryptBuffer(fullBufferEncrypt.slice(start, end), key, iv);
                decryptedBuffer = __spreadArray(__spreadArray([], decryptedBuffer), [chunkBufferDecrypted]);
            }
            return [2 /*return*/, decryptedBuffer];
        });
    });
};
exports.decryptFilesByChunks = decryptFilesByChunks;
/**
 * Encrypt a chunk
 * @param {Buffer} chunk The chunk
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @return {Promise<Buffer>}  The chunk encrypted
 */
var encryptBuffer = function (chunk, key, iv) { return __awaiter(void 0, void 0, void 0, function () {
    var cipher, encrypted;
    return __generator(this, function (_a) {
        cipher = crypto_1["default"].createCipheriv(ALGORITHM, Buffer.from(key, "base64"), Buffer.from(iv, "base64"));
        encrypted = cipher.update(chunk);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return [2 /*return*/, encrypted];
    });
}); };
exports.encryptBuffer = encryptBuffer;
/**
 * Decrypt a buffer
 * @param {Buffer} buffereEncrypted The buffer encrypted
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @return {Buffer} Rhe chunk decrypted
 */
var decryptBuffer = function (buffereEncrypted, key, iv) {
    var decipher = crypto_1["default"].createDecipheriv(ALGORITHM, Buffer.from(key, "base64"), Buffer.from(iv, "base64"));
    var decrypted = decipher.update(buffereEncrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
};
exports.decryptBuffer = decryptBuffer;
/**
 * Decrypt a file
 * @param {String} path The path of file to decrypt
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @return {Buffer}  The file decrypted
 */
var decryptFile = function (path, key, iv) { return __awaiter(void 0, void 0, void 0, function () {
    var fileEncrypted, decipher, decrypted;
    return __generator(this, function (_a) {
        fileEncrypted = fs_1["default"].readFileSync(path);
        decipher = crypto_1["default"].createDecipheriv(ALGORITHM, Buffer.from(key, "base64"), Buffer.from(iv, "base64"));
        decrypted = decipher.update(fileEncrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return [2 /*return*/, decrypted];
    });
}); };
exports.decryptFile = decryptFile;
