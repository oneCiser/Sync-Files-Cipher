"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var pathBckToCifrados = "./tmp/Cifrados/backup.png";
var clientBuffer = fs_1["default"].readFileSync("./tmp/client.png");
// cifrar archivo
//encryptAndSaveFile(clientBuffer, pathBckToCifrados);
// Función para validar que todo funciono
// (async () => {
//     const decryptedFile = await decryptFile('./tmp/Cifrados/backup.png');
//     console.log(decryptedFile);
//     fs.writeFileSync('./tmp/res-client.png', Buffer.from(decryptedFile));
// })()
//Simulación cliente servidor
// (async () => {
//     // Client side
//     console.log('Cliente-1')
//     const clientePath = "./tmp/client.png";
//     const clienteBuffer = fs.readFileSync(clientePath);
//     const clienteRollingHashes = createRollingHashs(clienteBuffer);
//     // Server side
//     console.log('Server-1')
//     const serverPath = './tmp/Cifrados/backup.png';
//     const serverBuffer = await decryptFile(serverPath);
//     const serverRollingHashes =  createRollingHashs(serverBuffer);
//     const serverRollingDiff = compareRolling(clienteRollingHashes, serverRollingHashes);
//     // Client side
//     console.log('Cliente-2')
//     const clientChanges = getChanges(serverRollingDiff, clienteBuffer);
//     // Server side
//     console.log('Server-2')
//     syncFile(clientChanges, serverBuffer, serverPath);
// })()
// sockets
// Simulación con sockets
var client_1 = require("./src/client");
(function () {
    console.log('Cliente-1');
    client_1.sync("./tmp/client.png");
})();
