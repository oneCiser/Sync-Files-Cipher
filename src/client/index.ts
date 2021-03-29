import WSFCClientSocket from './WSFCClientSocket'
import { getRollingHashes } from '../utils/rolling';
import { decryptFile } from '../utils/encrypt';
import { Action } from '../types';
import fs from 'fs';
import { getChanges } from './diff';

export const sync = async (clientePath: any, port: number = 9000, host: string = 'localhost') => {
    const wsfcSocket = WSFCClientSocket.getConnect(port, host)
    const fileClient = fs.readFileSync(clientePath);
    const rollingHashes = await getRollingHashes(clientePath)
    var buffersChanged: any = null;
    const req = JSON.stringify({
        rollingHashes,
        action:Action.COMPARE_ROLLINGS,
        path:clientePath,
        fileSize:fileClient.length
    });

    wsfcSocket.write(req);

    wsfcSocket.on('data', async  function(data){
        const res = JSON.parse(data.toString('utf-8'));
        if(res.action == Action.PREPARE_STREAM){
            console.log('PREPARE_STREAM');
            const bufferFile = fs.readFileSync(clientePath);
            buffersChanged = await getChanges(res.changesChunks, bufferFile);
            const req = {
                action:Action.STREAM_START,
                size:buffersChanged.length
            }
            wsfcSocket.write(JSON.stringify(req));

        }
        else if(res.action == Action.CLOSE_CONNECTION){
            console.log('CLOSE_CONNECTION');
            
            console.log('Archivo sincronizado');
            WSFCClientSocket.closeConnection();
            // (async () => {
            //     const decryptedFile = await decryptFile('./tmp/Cifrados/backup.png');
            //     console.log(decryptedFile);
            //     fs.writeFileSync('./tmp/res-client.png', Buffer.from(decryptedFile));
            // })()
        }
        else if(res.action == Action.STREAM_BUFFERS){
            console.log('STREAM_BUFFERS');
            const req = {
                action:Action.STREAM_BUFFERS,
                start: buffersChanged[res.index].start,
                buffer64:buffersChanged[res.index].buffer64,
                index:res.index,
            }
            
            wsfcSocket.write(JSON.stringify(req));  
        }
        
    })
}
