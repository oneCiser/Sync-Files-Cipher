import WSFCClientSocket from './WSFCClientSocket'
import { createClienteRollingHashes } from './Rolling'

export const sync = (clientePath: any, port: number = 9000, host: string = 'localhost') => {
    const wsfcSocket = WSFCClientSocket.getConnect(port, host)
    const clienteRollingHashes = createClienteRollingHashes(clientePath)
    
    const wraper = JSON.stringify({clienteRollingHashes, action:'compareRollings'})
    wsfcSocket.write(wraper)
    wsfcSocket.on('data',  function(data){
        console.log(data.toString('utf-8'));
    })
}
