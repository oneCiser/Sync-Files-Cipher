"use strict";
exports.__esModule = true;
exports.getAllChunks = exports.getChanges = void 0;
/**
 *
 *
 * @param {Array<Rolling>} rollignsChangedVector
 * @param {Buffer} buffer
 * @return  {Map} map of cnanged hashes:
 * {
       start: buffer64
    }
 */
var getChanges = function (rollignsChangedVector, buffer) {
    var bufferChanges = [];
    for (var i = 0; i < rollignsChangedVector.length; i++) {
        var start = rollignsChangedVector[i].start;
        var end = rollignsChangedVector[i].end;
        if (end >= buffer.length)
            end = buffer.length;
        var subBuffer = buffer.slice(start, end);
        bufferChanges.push({
            start: rollignsChangedVector[i].start,
            buffer64: subBuffer
        });
    }
    return bufferChanges;
};
exports.getChanges = getChanges;
/**
 *
 * Create a map of chunks from buffer
 * @param {Buffer} buffer
 * @return  {Map} map of chunks:
 * {
       start: buffer64
    }
 */
var getAllChunks = function (buffer, chunkSize) {
    if (chunkSize === void 0) { chunkSize = 3072; }
    var bufferChanges = [];
    for (var i = 0; i < Math.ceil(buffer.length / chunkSize); i++) {
        var start = i * chunkSize;
        var end = (i + 1) * chunkSize;
        if (end >= buffer.length)
            end = buffer.length;
        var subBuffer = buffer.slice(start, end);
        bufferChanges.push({
            start: start,
            buffer64: subBuffer.toString('base64')
        });
    }
    return bufferChanges;
};
exports.getAllChunks = getAllChunks;
