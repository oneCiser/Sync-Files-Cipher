import net from "net";
import fs from "fs";
import { Action, EventWatch } from "../types";
import {
  getRollingHashes,
  compareRolling,
  createRollingHashs,
} from "../utils/rolling";
import { syncFile } from "./diff";
import { encryptAndSaveFile } from "../utils/encrypt";
import { logger } from "../utils/logger";

/**
 * Create a socket server
 *
 * @param {string} aesKey The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {() => void} onLIstenCallback The callback when server is listening
 * @param {number} [port=9000] The port, default 9000
 * @return {net.Server}  The server as instance of net.Server
 */
export const createServer = (
  aesKey: string,
  iv: string,
  onLIstenCallback: () => void,
  port = 9000
): net.Server => {
  const SERVER = net.createServer(function (socket) {
    // contains the chunks changed
    var buffersChanged: any = {};
    // the size of chunks changed
    var buffersChangedSize = 0;
    // the sise from client file
    var fileClientSize = 0;

    // receive data from client
    socket.on("data", async function (data) {
      try {
        const req = JSON.parse(data.toString('utf-8'));

        // Copare rolling client  file with rolling server file
        if (req.action == Action.COMPARE_ROLLINGS) {
          fileClientSize = req.fileSize;

          //If file exist compare rollings
          if(fs.existsSync(req.path)){
            
            const serverRolling = await getRollingHashes(req.path);
            
            const changesChunks = await compareRolling(
              req.rollingHashes,
              serverRolling
            );
            
            const res = {
              action: Action.PREPARE_STREAM,
              changesChunks,
              fileExist: true
            };
            socket.write(JSON.stringify(res));
          }
          //else, stream all chunks
          else{
            
            const res = {
              action: Action.PREPARE_STREAM,
              fileExist: false
            };
            socket.write(JSON.stringify(res));
          }


          // start to send chunks changed
        } else if (req.action == Action.STREAM_START) {
          if (req.size == 0) {
            // not have changes

            // close connection
            const res = {
              action: Action.CLOSE_CONNECTION,
              action_successful: EventWatch.SYNC,
            };
            socket.write(JSON.stringify(res));
          } else {
            // Ask for the first chunk changed
            buffersChangedSize = req.size;
            const res = {
              action: Action.STREAM_BUFFERS,
              index: 0,
            };

            socket.write(JSON.stringify(res));
          }

          // Receive the chuncks request to request and ask the next chunk
        } else if (req.action == Action.STREAM_BUFFERS) {
          // If missing chunks for receive
          if (req.index < buffersChangedSize - 1) {
            const res = {
              index: req.index + 1,
              action: Action.STREAM_BUFFERS,
            };
            buffersChanged[req.start] = req.buffer64;
            socket.write(JSON.stringify(res));
          } else {
            // If finish received chunks

            buffersChanged[req.start] = req.buffer64;
            const res = {
              action: Action.CLOSE_CONNECTION, // close connection
              action_successful: EventWatch.SYNC,
            };

            await syncFile(
              buffersChanged,
              req.path,
              fileClientSize,
              aesKey,
              iv
            );
            
            socket.write(JSON.stringify(res));
          }
        }

        // if remove a file
        else if (req.action == Action.REMOVE_FILE) {
          // Remove file
          logger.info(`Remove file: ${req.path}`);
          if (fs.existsSync(req.path)) {
            fs.unlinkSync(req.path);
          }

          const res = {
            action: Action.CLOSE_CONNECTION, // close connection
            action_successful: EventWatch.REMOVE_FILE,
          };
          socket.write(JSON.stringify(res));
        }

        // if remove a directory
        else if (req.action == Action.REMOVE_DIR) {

          logger.info(`Remove dir: ${req.path}`);
          // Remove dir
          if (fs.existsSync(req.path)) {
            fs.rmdirSync(req.path, { recursive: true });
          }

          const res = {
            action: Action.CLOSE_CONNECTION, // close connection
            action_successful: EventWatch.REMOVE_DIR,
          };
          socket.write(JSON.stringify(res));
        }

        // if add file


        // if add directory
        else if (req.action == Action.ADD_DIR) {

          logger.info(`Add dir: ${req.path}`);
          // Save dir
          if (!fs.existsSync(req.path)) {
            await fs.mkdirSync(req.path, { recursive: true });
          }

          const res = {
            action: Action.CLOSE_CONNECTION, // close connection
            action_successful: EventWatch.ADD_DIR,
          };
          socket.write(JSON.stringify(res));
        }
      } catch (error) {
        // Aplicaction cras
        logger.error(`??? Server error: ${error.message}`);

        const res = {
          action: Action.ERROR, // send error to client
          message: error.message,
        };
        socket.write(JSON.stringify(res));
      }
    });
  });

  // listen and call user callback

  SERVER.listen(port, () => {
    if (onLIstenCallback) onLIstenCallback();
  });

  return SERVER;
};
