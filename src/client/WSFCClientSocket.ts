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
   * @static
   * @type {net.Socket}
   * @memberof WSFCClientSocket
   */
  private static socket: any;

  /**
   * Set handles error and connect event
   *
   * @private
   * @static
   * @memberof WSFCClientSocket
   */
  private static handles() {
    this.socket.on("connect", function () {
      console.log("Connect with socket sussfull");
    });

    this.socket.on("error", function (error: any) {
      console.log("Conection error: ", error);
    });
  }


  /**
   * Singleton.
   * @memberof WSFCClientSocket
   */
  private constructor() {}


  /**
   * Create a connect
   *
   * @static
   * @param {number} port The server port
   * @param {string} host The server host
   * @return {net.Socket} The new socket
   * @memberof WSFCClientSocket
   */
  public static getConnect(port: number, host: string): net.Socket {
    this.createSocket();
    this.socket.connect(port, host);
    this.handles();
    return this.getSocket();
  }


  /**
   * Create a new socket 
   *
   * @private
   * @static
   * @memberof WSFCClientSocket
   */
  private static createSocket() {
    // create a soccket
    if (!this.socket) this.socket = new net.Socket();
  }


  /**
   *  Return exist socket
   *
   * @static
   * @return net.Socket 
   * @memberof WSFCClientSocket
   */
  public static getSocket(): net.Socket {
    return this.socket;
  }


  /**
   * Close connection
   *
   * @static
   * @memberof WSFCClientSocket
   */
  public static closeConnection() {
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
