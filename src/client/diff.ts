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
export const getChanges = (rollignsChangedVector: Array<Rolling>,  buffer: Buffer): any => {
    let bufferChanges: any = []
    for (let i = 0; i < rollignsChangedVector.length; i++) {
        let start = rollignsChangedVector[i].start;
        let end = rollignsChangedVector[i].end;
        if(end >= buffer.length) end = buffer.length;
        let subBuffer = buffer.slice(start, end);
        bufferChanges.push({
            start:rollignsChangedVector[i].start,
            buffer64:subBuffer.toString('base64')
        })
    }
    
    
    return bufferChanges;
}