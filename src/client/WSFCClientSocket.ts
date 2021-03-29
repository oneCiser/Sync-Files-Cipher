import net from 'net'


export default class WSFCClientSocket {

    private static socket: net.Socket;

    private static handles() {
        // connect event 
        this.socket.on('connect', function () {
            console.log("Connect with socket sussfull");
        })


        this.socket.on('error', function (error: any){
            console.log("Conection error: ", error);
        } )
    }

    private  constructor() {

    }

    public static  getConnect(port: number, host: string){
            this.createSocket()
            this.socket.connect(port, host);
            this.handles()
            return this.getSocket()
    }

    private static createSocket(){
         // creat a soccket
        if(!this.socket) this.socket = new net.Socket();
    }

    public static getSocket(){
        return this.socket
    }

    public static closeConnection(){
        if(this.socket){
            this.socket.removeAllListeners('error')
            this.socket.destroy();
            console.log('Connection close')
        }else{
            throw new Error("Socket not exist")
        }
    }

}