import net from 'net'
import { Action } from '../types';
import { getRollingHashes, compareRolling } from '../utils/rolling';
import { syncFile } from './diff';

const PORT = process.argv[3] || '9000'


// create a server
const SERVER = net.createServer(function (socket) {

    // echo
    var buffersChanged: any = {};
    var buffersChangedSize = 0;
    var fileClientSize = 0;
    socket.on('data', async function (data) {
        // console.log(data.toString());
        const  req = JSON.parse(data.toString());
        
        
        if(req.action == Action.COMPARE_ROLLINGS){
            console.log('COMPARE_ROLLINGS');
            fileClientSize = req.fileSize;
            const serverRolling = await getRollingHashes('../../tmp/Cifrados/backup.png');
            const changesChunks = await compareRolling(req.rollingHashes,serverRolling);
            
            const res = {
                action:Action.PREPARE_STREAM,
                changesChunks
            }
            socket.write(JSON.stringify(res));
        }

        else if(req.action == Action.STREAM_START){
            console.log('STREAM_START');
            
            if(req.size == 0){
                const res = {
                    action:Action.CLOSE_CONNECTION
                }
                socket.write(JSON.stringify(res));
                
            }
            else{
                buffersChangedSize = req.size;
                const res = {
                    action:Action.STREAM_BUFFERS,
                    index:0
                }
                socket.write(JSON.stringify(res));
            }

        }
        else if(req.action == Action.STREAM_BUFFERS){
            console.log('STREAM_BUFFERS');
            
            if(req.index < buffersChangedSize - 1){
                const res = {
                    index: req.index + 1,
                    action:Action.STREAM_BUFFERS
                }
                buffersChanged[req.start] = req.buffer64
                socket.write(JSON.stringify(res));
            }
            else{
                console.log('End');
                
                buffersChanged[req.start] = req.buffer64
                const res = {
                    action:Action.CLOSE_CONNECTION
                }
                
                await syncFile(buffersChanged, '../../tmp/Cifrados/backup.png', fileClientSize)
                socket.write(JSON.stringify(res));  
                
            }
        }
    })
})

// listen
SERVER.listen(parseInt(PORT), () => {
    console.log("Socket on port:", PORT);
})