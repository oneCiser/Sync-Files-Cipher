const {syncFile, changeRolling, createRollingHashs} = require('./saveDiff');
const {getChanges} = require('./clientSaveDiff');
const {decryptFile, encryptAndSaveFile} = require('./encrypt');
const fs = require('fs');



const pathBckToCifrados = './Cifrados/backup.mp4'; 
const clientBuffer = fs.readFileSync('./client.mp4');



// encryptAndSaveFile(clientBuffer, pathBckToCifrados);
// Lee archivo cifrado del backup y hace una actualización con el archivo del cliente y lo cifra
// (async () => {
//     //Archivo cliente
//     const clienteFile = fs.readFileSync(clienteMenor);
//     //Buffer archivo backup decifrado
//     const bufferDecrypt = await decryptFile(pathBckToCifrados);
//     //Compara y actualiza [cifrado]
//     webSync(clienteFile, bufferDecrypt, pathBckToCifrados);
    
// })()

// Función para validar que todo funciono
// (async () => {
//     const decryptedFile = await decryptFile('./Cifrados/backup.mp4');
//     fs.writeFileSync('./res-client.mp4', decryptedFile);
    
// })()

// Simulación cliente servidor
(async () => {

    // Client side
    console.log('Cliente-1')
    const clientePath = "client.mp4";
    const clienteBuffer = fs.readFileSync(clientePath);
    const clienteRollingHashes = createRollingHashs(clienteBuffer);

    // Server side
    console.log('Server-1')
    const serverPath = './Cifrados/backup.mp4';
    const serverBuffer = await decryptFile(serverPath);
    const serverRollingHashes =  createRollingHashs(serverBuffer);
    const serverRollingDiff = changeRolling(clienteRollingHashes, serverRollingHashes);

    // Client side
    console.log('Cliente-2')
    const clientChanges = getChanges(serverRollingDiff, clienteBuffer);

    // Server side
    console.log('Server-2')
    syncFile(clientChanges, serverBuffer, serverPath);

})()




