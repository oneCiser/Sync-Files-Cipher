import { Rolling } from '../types'
import { createHash } from 'crypto';
import fs from 'fs'


/**
 * Create an arrasy of hash for each chunk of buffer
 * @param {Buffer} buffer The buffer to create rolling hashes 
 * @param {number} [chunkSize=8192]  The size of chunk, default 3072 bytes
 * @return {Array} Array of hashes from each chunk
 */
export const createRollingHashs = async (buffer: any, chunkSize: number = 8192) => {
    var hashes = []
    for (let i = 0; i < Math.ceil(buffer.length/chunkSize); i++) {
        var start = i*chunkSize;
        var end = (i+1)*chunkSize;
        if(end >= buffer.length) end = buffer.length;
        var hashed = await createHash('sha256').update(buffer.slice(start,end),"utf-8").digest('hex');
        hashes.push(hashed);
        
    }
    return hashes;
}
/**
 * Create array of hashes from file path
 * @param path Path of file
 * @returns {Array} Array of hashes from each chunk
 */
export const getRollingHashes = async (path: any) => {
    const buffer = fs.readFileSync(path);
    const clienteRollingHashes = await createRollingHashs(buffer);
    return clienteRollingHashes
}

/**
 * Compare rollings of file client and file server
 * @param {Array} clientRolling Array of hashes from file client
 * @param {Array} serverRolling Array of hashes from file server
 * @param {number} [chunkSize=8192] The size of chunk,  default 3072 bytes
 * @return {Array}  Array of object of hashes differents with your range of byte
 */
export const compareRolling = (clientRolling: Array<String>, serverRolling: Array<String>, chunkSize: number = 8192): Array<Rolling> => {
    let match = [];
    for (let i = 0; i < clientRolling.length; i++) {
        if(!serverRolling[i] || clientRolling[i] != serverRolling[i]){
            match.push({
                hash:clientRolling[i],
                start:i*chunkSize,
                end:(i+1)*chunkSize
            });
        }
        
    }

    return match;

}
