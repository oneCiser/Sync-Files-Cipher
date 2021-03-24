const fs = require('fs');
const {createHash} = require('crypto');
const {encryptFile} = require('./encrypt');

const createRollingHashs = (buffer, chunkSize = 3072) => {
    var hashes = []
    for (let i = 0; i < Math.ceil(buffer.length/chunkSize); i++) {
        var start = i*chunkSize;
        var end = (i+1)*chunkSize;
        if(end >= buffer.length) end = buffer.length;
        var hashed = createHash('sha256').update(buffer.slice(start,end),"utf-8").digest('hex');
        hashes.push(hashed);
        
    }
    return hashes;
}


const webSync = (clientBuffer, backUpBuffer, path, chunkSize = 3072) => {

    let backUpBufferSHA = createRollingHashs(backUpBuffer,chunkSize);
    let clientBufferSHA = createRollingHashs(clientBuffer,chunkSize);
    let typeSync = backUpBuffer.length > clientBuffer.length ? 'decrement' : backUpBuffer.length < clientBuffer.length ? 'increment' : 'equals';
    let tmpBuffer = []

    for (let i = 0; i < clientBufferSHA.length; i++) {
        let start = i*chunkSize;
        let end = (i+1)*chunkSize;
        if(end>=clientBuffer.length) end = clientBuffer.length
        if(!backUpBufferSHA[i] || clientBufferSHA[i] != backUpBufferSHA[i]){
            let subBuffer = clientBuffer.slice(start,end)
            tmpBuffer = [...tmpBuffer, ...subBuffer]
        }
        else{
            let subBuffer = backUpBuffer.slice(start,end)
            tmpBuffer = [...tmpBuffer, ...subBuffer]
        }
        
    }

    console.log("Backup size: ", backUpBufferSHA.length*chunkSize);
    console.log("Client size: ", clientBuffer.length*chunkSize);
    console.log("New size: ", Buffer.from(tmpBuffer).length*chunkSize);
    console.log('Type sync: ', typeSync);

    fs.open(path, 'w', async function(err, fd) {
        if (err) {
            throw 'could not open file: ' + err;
        }
        const bufferCifrado = await encryptFile(Buffer.from(tmpBuffer));
        fs.writeSync(fd, bufferCifrado , 0, bufferCifrado.length, null);
                
            
    
    });
}
// Retorna true si los hash considieron o false si no
const changeRolling = (clientRolling, serverRolling, chunkSize = 3072) => {
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

// {
//     buffer64:string,
//     start:number,
//     end:number
// }
// {
//     start: buffer64
// }
const syncFile = (arrayChanges, backUpBuffer, path, chunkSize = 3072) => {
    let tmpBuffer = []
    //la cantidad de sub buffers del backup
    let chunks = Math.ceil(backUpBuffer.length/chunkSize);

    for (let i = 0; i < chunks; i++) {
        let start = i*chunkSize;
        let end = (i+1)*chunkSize;
        if(end >= backUpBuffer.length){ 
            end = backUpBuffer.length;
        }
        if(arrayChanges[start]){
            let subBuffer = Buffer.from(arrayChanges[start], 'base64');
            tmpBuffer = [...tmpBuffer, ...subBuffer]
        }
        else{
            let subBuffer = backUpBuffer.slice(start,end)
            tmpBuffer = [...tmpBuffer, ...subBuffer]
        }
        
    }



    fs.open(path, 'w', async function(err, fd) {
        if (err) {
            throw 'could not open file: ' + err;
        }
        const bufferCifrado = await encryptFile(Buffer.from(tmpBuffer));
        fs.writeSync(fd, bufferCifrado , 0, bufferCifrado.length, null);
                
            
    
    });
}



module.exports = {syncFile, changeRolling, createRollingHashs}






