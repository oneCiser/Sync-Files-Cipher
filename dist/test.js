"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var pathBckToCifrados = "/tmp/Cifrados/backup.txt";
var clientPath = "/tmp/client.txt";
var clientBuffer = fs_1["default"].readFileSync(clientPath);
// cifrar archivo
//encryptAndSaveFile(clientBuffer, pathBckToCifrados);
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
// sockets
// Simulación con sockets
// import { sync } from './src/client'
// import { EventWatch } from './src/types'
// (() => {
//   sync(clientPath, function (eventType: EventWatch, pathChanged: string)  {
//       console.log("Succes sync: Aqui el client hace algo");
//       console.log(eventType, pathChanged);
//        // Prueba de sincronización
//        (async () => {
//         const decryptedFile = await decryptFile(pathBckToCifrados);
//         console.log("Nuevo contenido: ", decryptedFile.toString());
//         fs.writeFileSync("/tmp/sync.txt", Buffer.from(decryptedFile));
//       })();
//   }, function (error: any) {
//     console.log("Sync error: ", error);
//   })
// })();
// server
var server_1 = require("./src/server");
server_1.createServer(function () {
    console.log("Server listening");
});
