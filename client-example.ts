import { sync } from ".";
import { EventWatch } from "./src/types";
const clientPath = "D:/yo/U/Proyecto/Servers/syncProyect/dist/tmp/client";
import { decryptFile } from "./src/utils/encrypt";
import fs from "fs";


(async () => {
  const watcher = await sync(
    clientPath,
    function (eventType: EventWatch, pathChanged: string) {
      console.log("--- Succes sync ---");
      console.log(eventType, pathChanged);

      // Prueba de sincronización
      // (async () => {

      //   const isDirectory = fs.statSync(pathChanged).isDirectory()
      //   const exist = fs.existsSync(pathChanged)
        
      //   console.log("Exist ?: ", exist);
      //   console.log("Is directory ?: ", isDirectory);

      //   if(!isDirectory && exist){
      //     const buffer = await decryptFile(`/home/ingdeiver/streams-for-lab.co/deiver-guerra-carrascal${pathChanged}`,
      //     '8BZ3pCTp71LX5I//QsBYdz7w4JHXNVehSBXuXnScdqg=',
      //     'AAAAAAAAAAAAAAAAAAAAAA==')
      //     console.log(buffer.toString());
      //   }
        
      // })();
    },
    
    function (error: any) {
      console.log("Sync error: ", error);
    },
    './tmp/server'
  );

  // simula close
  // watcher.close()
  // .then(() => 
  // console.log("Watcher closed"))

})();
