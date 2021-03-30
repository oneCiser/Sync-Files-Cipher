import { syncFile } from "./src/server/diff";
import { compareRolling, createRollingHashs } from "./src/utils/rolling";
import { getChanges } from "./src/client/diff";
import { encryptAndSaveFile, decryptFile } from "./src/utils/encrypt";
import fs from "fs";

// const pathBckToCifrados = "/tmp/Cifrados/backup.txt";
// const clientPath = "/tmp/client/client.txt"
// const clientBuffer = fs.readFileSync(clientPath);

// cifrar archivo
// encryptAndSaveFile(clientBuffer, pathBckToCifrados);

// Función para validar que todo funciono
// (async () => {
//     const decryptedFile = await decryptFile(pathBckToCifrados);
//     console.log(decryptedFile.toString());
//    // fs.writeFileSync('./tmp/res-client.png', Buffer.from(decryptedFile));
// })()

//Simulación cliente servidor
// (async () => {

//     // Client side
//     console.log('Cliente-1')
//     const clientePath = "./tmp/client.png";
//     const clienteBuffer = fs.readFileSync(clientePath);
//     const clienteRollingHashes = await createRollingHashs(clienteBuffer);

//     // Server side
//     console.log('Server-1')
//     const serverPath = './tmp/Cifrados/backup.png';
//     const serverBuffer = await decryptFile(serverPath);
//     const serverRollingHashes = await  createRollingHashs(serverBuffer);
//     const serverRollingDiff = compareRolling(clienteRollingHashes, serverRollingHashes);

//     // Client side
//     console.log('Cliente-2')
//     const clientChanges = getChanges(serverRollingDiff, clienteBuffer);

//     // Server side
//     console.log('Server-2')
//     syncFile(clientChanges, serverPath);

// })()

// server
import { createServer } from '.'
createServer(() => {
  console.log("Server listening");
  
})
