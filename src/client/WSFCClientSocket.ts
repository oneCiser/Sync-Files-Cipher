import net from "net";

/**
 * Class for managament client connection
 * @export
 * @class WSFCClientSocket
 */
export default class WSFCClientSocket {
  /**
   *
   *
   * @private
   * 
   * @type {net.Socket}
   * @memberof WSFCClientSocket
   */
  private socket: any;

  /**
   * Set handles error and connect event
   *
   * @private
   * 
   * @memberof WSFCClientSocket
   */
  private handles() {
    this.socket.on("connect", function () {
    });

    
  }


  /**
   * Singleton.
   * @memberof WSFCClientSocket
   */
  public constructor() {}


  /**
   * Create a connect
   *
   * 
   * @param {number} port The server port
   * @param {string} host The server host
   * @return {net.Socket} The new socket
   * @memberof WSFCClientSocket
   */
  public getConnect(port: number, host: string): net.Socket {
    this.createSocket();
    this.socket.connect(port, host);
    this.handles();
    return this.getSocket();
  }


  /**
   * Create a new socket 
   *
   * @private
   * 
   * @memberof WSFCClientSocket
   */
  private createSocket() {
    // create a soccket
    this.socket = new net.Socket();
  }


  /**
   *  Return exist socket
   *
   * 
   * @return net.Socket 
   * @memberof WSFCClientSocket
   */
  public getSocket(): net.Socket {
    return this.socket;
  }


  /**
   * Close connection
   *
   * 
   * @memberof WSFCClientSocket
   */
  public closeConnection() {
    if (this.socket) {
      this.socket.removeAllListeners("error");
      this.socket.destroy();
      this.socket = null;
      console.log("Connection close");
    } else {
      throw new Error("Socket not exist");
    }
  }
}
