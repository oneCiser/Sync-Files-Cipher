import WSFCClientSocket from "./WSFCClientSocket";
import { getRollingHashes } from "../utils/rolling";
import { Action } from "../types";
import fs from "fs";
import { getChanges, getAllChunks } from "./diff";
import { watch } from "./watch";
import { EventWatch } from "../types";
import net from "net";
import path from 'path'
import { logger } from '../utils/logger'


/**
 * Join paths client with prefix server path
 *
 * @param {string} serverPrefix The prefix server path
 * @param {string} clientPath The client path
 * @return {string} The path joined
 */
const joinPath = (serverPrefix: string, clientPath: string): string => {
  return path.join(serverPrefix, clientPath).replace(/\\/g, '/')
}
/**
 * Listen the connection error's socket
 * @param {net.Socket} socket The socket
 * @param {Function} userErrorCallback The callback to call when sync crash: (error) => {}
 * @param userErrorCallback 
 */
const onConnectError = (socket:net.Socket, userErrorCallback: (error: any) => void) => {
  socket.on("error", function (error: any) {
    userErrorCallback('❌ Connection error: ' + error.message);
  });
}


/**
 * Set common actions
 *
 * @param {net.Socket} wsfcSocket The socket for listen data
 * @param {Function} userWatchCallback The callback to call when sync finish: (event, type) => {}
 * @param {Function} userErrorCallback The callback to call when sync crash: (error) => {}
 * @param {EventWatch} eventType The type of event
 * @param {string} pathChanged The path of file or directory changed
 */
const socketCommonHandlers = (
  wsfcSocket: net.Socket,
  wSFCClientSocketInstance: any,
  userWatchCallback: (eventType: EventWatch, pathChanged: string) => void,
  userErrorCallback: (error: any) => void,
  eventType: EventWatch, 
  pathChanged: string
) => {
  wsfcSocket.on("data", async function (data: any) {
    const res = JSON.parse(data.toString("utf-8"));
    
    //Show action executed
    
    logger.info(`The path: ${pathChanged} arised: ${eventType}`);

    if (res.action == Action.CLOSE_CONNECTION) {
      wSFCClientSocketInstance.closeConnection();
      userWatchCallback(res.action_successful, pathChanged);

      // If exist error call user error callback
    } else if (res.action == Action.ERROR) {
      wSFCClientSocketInstance.closeConnection();
      userErrorCallback(new Error(res.message));
    }
  });
};


/**
 * Set common handles sync
 *
 * @param {net.Socket} wsfcSocket The socket for listen data
 * @param {Function} userWatchCallback The callback to call when sync finish: (event, type) => {}
 * @param {Function} userErrorCallback The callback to call when sync crash: (error) => {}
 * @param {string} pathChanged The path of file or directory changed
 * @param {any} buffersChanged The buffer to change
 * @param {string} pathPrefix The path prefix of server's side
 * @param {string} folderToSync The path of only folder to sync
 */
const syncCommonHandlers = (
  wsfcSocket: net.Socket,
  wSFCClientSocketInstance: any,
  userWatchCallback: (eventType: EventWatch, pathChanged: string) => void,
  userErrorCallback: (error: any) => void,
  pathChanged: string,
  buffersChanged: any,
  pathPrefix: string,
  folderToSync: string
) => {

  wsfcSocket.on("data", async function (data: any) {
    const res = JSON.parse(data.toString('utf-8'));
    

    // If server detcting changes, prepare the syncronization
    if (res.action == Action.PREPARE_STREAM) {
      // the client file buffer
      const bufferFile = fs.readFileSync(pathChanged);

      //Get only the chunks changes
      if(res.fileExist){
        // The chunks changed
        buffersChanged = await getChanges(res.changesChunks, bufferFile);

        const req = {
          action: Action.STREAM_START, // Start the shipment of chunks
          size: buffersChanged.length, // the size of fclient file
        };
        wsfcSocket.write(JSON.stringify(req));
      }
      //Else, send all chunks
      else{
        buffersChanged = await getAllChunks(bufferFile);
        const req = {
          action: Action.STREAM_START, // Start the shipment of chunks
          size: buffersChanged.length, // the size of fclient file
        };
        wsfcSocket.write(JSON.stringify(req));
      }
      


      // Receive and send chunks
    } else if (res.action == Action.STREAM_BUFFERS) {
      
      
      
      const req = {
        action: Action.STREAM_BUFFERS,
        start: buffersChanged[res.index].start,
        buffer64: buffersChanged[res.index].buffer64,
        index: res.index,
        path: joinPath(pathPrefix, folderToSync ),
      };

      wsfcSocket.write(JSON.stringify(req));

      // close connection and call user callback
    } else if (res.action == Action.CLOSE_CONNECTION) {
      wSFCClientSocketInstance.closeConnection();

      // when finish call user callback
      userWatchCallback(res.action_successful, pathChanged);

      // If exist error call user error callback
    } else if (res.action == Action.ERROR) {
      wSFCClientSocketInstance.closeConnection();

      // when finish call user callback
      userErrorCallback(new Error(res.message));
    }
  });

}

/**
 * Sync the file client with backup files when there are changes
 *
 * @param {string} pathToWatch The path to watch
 * @param {Function} userWatchCallback The callback to call when sync is executed.: (event, type) => {}
 * @param {Function} userErrorCallback The callback to call when sync is crashed.: (error) => {}
 * @param {number} [port=9000] The server port, default 9000
 * @param {string} [host="localhost"] The server host, default localhost
 * @param {string} pathPrefix The prefix path, default empty
 * @return {FSWatcher} The FSwatcher instance
 */
export const sync = async (
  pathToWatch: string,
  userWatchCallback: (eventType: EventWatch, pathChanged: string) => void,
  userErrorCallback: (error: any) => void,
  pathPrefix: string = '',
  port: number = 9000,
  host: string = "localhost"
) => {
  // create a wath over the path
  // Execute for each change
  // eventType: The type event
  // path: The path of file or directory changed
  const watcher =  watch(pathToWatch, async (eventType: EventWatch, pathChanged: string) => {
    
    try {
      // if the file change, start the sync
      
      //Only send the content of watch folder
    
      const folderToSync = pathChanged.replace(pathToWatch,'');

      if (eventType === EventWatch.SYNC) {
        

        // create a socket
        const wSFCClientSocketInstance = new WSFCClientSocket()
        const wsfcSocket = wSFCClientSocketInstance.getConnect(port, host);
        onConnectError(wsfcSocket, userErrorCallback)
        // load file to sync
        const fileClient = fs.readFileSync(pathChanged);
        // create rollings
        const rollingHashes = await getRollingHashes(pathChanged);
        // contains the bytes that was changed
        var buffersChanged: any = null;

        // make a request for start to compare bytes
        const req = JSON.stringify({
          rollingHashes, // hashes from client file
          action: Action.COMPARE_ROLLINGS,
          path: joinPath(pathPrefix, folderToSync), // path of file to sync server
          fileSize: fileClient.length, // size of client file
        });

        // make first request to server
        wsfcSocket.write(req);

        // listen response from server and make new requests
        syncCommonHandlers(
          wsfcSocket,
          wSFCClientSocketInstance,
          userWatchCallback,
          userErrorCallback,
          pathChanged,
          buffersChanged,
          pathPrefix,
          folderToSync);

      }

      // if remove a file
      else if (eventType === EventWatch.REMOVE_FILE) {
        
        // create a socket
        const wSFCClientSocketInstance = new WSFCClientSocket()
        const wsfcSocket = wSFCClientSocketInstance.getConnect(port, host);
        onConnectError(wsfcSocket, userErrorCallback);
        // make a request for remove backup
        const req = JSON.stringify({
          action: Action.REMOVE_FILE,
          path: joinPath(pathPrefix, folderToSync),
        });
        wsfcSocket.write(req);

        // common hanlders for current socket data
        socketCommonHandlers(wsfcSocket, wSFCClientSocketInstance, userWatchCallback, userErrorCallback, eventType, pathChanged)


      } 

      // if remove a directory
      else if (eventType === EventWatch.REMOVE_DIR) { 
        
        // create a socket
        const wSFCClientSocketInstance = new WSFCClientSocket()
        const wsfcSocket = wSFCClientSocketInstance.getConnect(port, host);
        onConnectError(wsfcSocket, userErrorCallback);
        // make a request for remove backup
        const req = JSON.stringify({
          action: Action.REMOVE_DIR,
          path: joinPath(pathPrefix, folderToSync),
        });
        wsfcSocket.write(req);

        // common hanlders for current socket data
        socketCommonHandlers(wsfcSocket,wSFCClientSocketInstance, userWatchCallback, userErrorCallback, eventType, pathChanged)
      }
     

      


      // if add directory
      else if (eventType === EventWatch.ADD_DIR) { 
        
        // create a socket
        const wSFCClientSocketInstance = new WSFCClientSocket()
        const wsfcSocket = wSFCClientSocketInstance.getConnect(port, host);
        onConnectError(wsfcSocket, userErrorCallback);
        // make a request for create dir backup
        const req = JSON.stringify({
          action: Action.ADD_DIR,
          path: joinPath(pathPrefix, folderToSync),
        });
        wsfcSocket.write(req);

        // common hanlders for current socket data
        socketCommonHandlers(wsfcSocket, wSFCClientSocketInstance, userWatchCallback, userErrorCallback, eventType, pathChanged)
      }

      

    } catch (error) {
      // when exist error call user error callback
      userErrorCallback(error);
    }
  });

  return watcher
};
