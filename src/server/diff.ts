import fs from 'fs'
import { encryptBuffer } from '../utils/encrypt';
import { decryptFile } from '../utils/encrypt';


/**
 * Sync file server with file from client
 * @param {Array<String>} arrayChanges The map of buffers changed: { start: buffer64 }
 * @param { Buffer } backUpBuffer The buffer of server file
 * @param { String } path The path of file to sync
 * @param { number } [chunkSize = 3072] The size of chunks, default 3072
 */
export const syncFile = async (arrayChanges: any, path: any, fileClientSize: number, key: string, iv: string, chunkSize: number = 3072) => {
    console.log("Decrypting and sync file encrypted: ", path);
    
    const backUpBuffer = await decryptFile(path, key, iv);
    let tmpBuffer: any = []
    //la cantidad de sub buffers del backup
    let chunks = Math.ceil(fileClientSize/chunkSize)  //Math.ceil(backUpBuffer.length/chunkSize);

    for (let i = 0; i < chunks; i++) {
        let start = i*chunkSize;
        let end = (i+1)*chunkSize;
        if(end >= backUpBuffer.length){ 
            end = backUpBuffer.length;
        }
        
        if(arrayChanges[start]){
            let subBuffer: any = Buffer.from(arrayChanges[start], 'base64');
            tmpBuffer = [...tmpBuffer, ...subBuffer]
        }
        else{
            let subBuffer: any = backUpBuffer.slice(start,end)
            tmpBuffer = [...tmpBuffer, ...subBuffer]
        }
        
    }

    fs.open(path, 'w', async function(err: any, fd: any) {
        if (err) {
            throw 'could not open file: ' + err;
        }
        const bufferCifrado = await encryptBuffer(Buffer.from(tmpBuffer), key, iv);
        fs.writeSync(fd, bufferCifrado , 0, bufferCifrado.length, null);
    });
}



