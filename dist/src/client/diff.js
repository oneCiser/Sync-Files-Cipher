"use strict";
exports.__esModule = true;
exports.getChanges = void 0;
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
    var bufferChanges = {};
    for (var i = 0; i < rollignsChangedVector.length; i++) {
        var start = rollignsChangedVector[i].start;
        var end = rollignsChangedVector[i].end;
        if (end >= buffer.length)
            end = buffer.length;
        var subBuffer = buffer.slice(start, end);
        bufferChanges[rollignsChangedVector[i].start] = subBuffer.toString('base64');
    }
    return bufferChanges;
};
exports.getChanges = getChanges;
