import { Rolling } from '../types'



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
export const getChanges = (rollignsChangedVector: Array<Rolling>, buffer: Buffer): any => {
    let bufferChanges: any = []
    for (let i = 0; i < rollignsChangedVector.length; i++) {
        let start = rollignsChangedVector[i].start;
        let end = rollignsChangedVector[i].end;
        if (end >= buffer.length) end = buffer.length;
        let subBuffer = buffer.slice(start, end);
        bufferChanges.push({
            start: rollignsChangedVector[i].start,
            buffer64: subBuffer.toString('base64')
        })
    }


    return bufferChanges;
}


/**
 *
 * Create a map of chunks from buffer
 * @param {Buffer} buffer
 * @return  {Map} map of chunks:
 * {
       start: buffer64
    }
 */
export const getAllChunks = (buffer: Buffer, chunkSize: number = 3072): any => {

    let bufferChanges: any = []
    for (let i = 0; i < Math.ceil(buffer.length / chunkSize); i++) {
        let start = i * chunkSize;
        let end = (i + 1) * chunkSize;
        if (end >= buffer.length) end = buffer.length;
        let subBuffer = buffer.slice(start, end);
        bufferChanges.push({
            start: start,
            buffer64: subBuffer.toString('base64')
        })
    }


    return bufferChanges;
}