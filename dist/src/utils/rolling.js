"use strict";
exports.__esModule = true;
exports.compareRolling = exports.createRollingHashs = void 0;
var crypto_1 = require("crypto");
/**
 * Create an arrasy of hash for each chunk of buffer
 * @param {Buffer} buffer The buffer to create rolling hashes
 * @param {number} [chunkSize=3072]  The size of chunk, default 3072 bytes
 * @return {Array} Array of hashes from each chunk
 */
var createRollingHashs = function (buffer, chunkSize) {
    if (chunkSize === void 0) { chunkSize = 3072; }
    var hashes = [];
    for (var i = 0; i < Math.ceil(buffer.length / chunkSize); i++) {
        var start = i * chunkSize;
        var end = (i + 1) * chunkSize;
        if (end >= buffer.length)
            end = buffer.length;
        var hashed = crypto_1.createHash('sha256').update(buffer.slice(start, end), "utf-8").digest('hex');
        hashes.push(hashed);
    }
    return hashes;
};
exports.createRollingHashs = createRollingHashs;
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
