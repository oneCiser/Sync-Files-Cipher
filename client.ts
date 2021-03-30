import { sync } from ".";
import { EventWatch } from "./src/types";
const pathBckToCifrados = "/tmp/Cifrados/backup.txt";
const clientPath = "/tmp/client";
import { decryptFile } from "./src/utils/encrypt";
import fs from "fs";

// Simulación con sockets
(async () => {
  const watcher = await sync(
    clientPath,
    function (eventType: EventWatch, pathChanged: string) {
      console.log("Succes sync: Aqui el client hace algo");
      console.log(eventType, pathChanged);
      // Prueba de sincronización
      (async () => {
        if (fs.existsSync(pathChanged) && !fs.statSync(pathChanged).isDirectory) {
          const decryptedFile = await decryptFile(`/home/ingdeiver/streams-for-lab.co/deiver-guerra-carrascal${pathChanged}`);
          console.log("Nuevo contenido: ", decryptedFile.toString());
        } else {
          console.log(`${pathChanged} not exist`);
        }
      })();
    },
    function (error: any) {
      console.log("Sync error: ", error);
    },
    '/home/ingdeiver/streams-for-lab.co/deiver-guerra-carrascal'
  );

  // simula close
  // watcher.close()
  // .then(() => 
  // console.log("Watcher closed"))

})();
