import crypto from "crypto"
import fs from "fs"

const ALGORITHM = "aes-256-cbc";
const key = "8BZ3pCTp71LX5I//QsBYdz7w4JHXNVehSBXuXnScdqg=";
const iv = "AAAAAAAAAAAAAAAAAAAAAA==";

/**
 * Encrypt and save a file
 * @param {Buffer} file The file to encrypt
 * @param {String} path The path of file
 * @return {Buffer}  The buffer encrypted
 */
export const encryptAndSaveFile = async (file: Buffer, path: any): Promise<Buffer> => {
  let cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );
  let encrypted: Buffer = cipher.update(file);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  fs.writeFileSync(path, encrypted);
  return encrypted;
};





/**
 * Encrypt and save a file by chunks
 * @param {Buffer} file The file to encrypt
 * @param {String} path The path of file
 * @param {number} [chunksize=3072] The size of chunks
 */
export const encryptAndSaveChunk = (file: Buffer, path: any, chunksize: number = 3072): void => {
  const chunks = Math.ceil(file.length / chunksize);

  fs.open(path, "w+", async function (err, fd) {
    for (let index = 0; index < chunks; index++) {
      const start = index * chunksize;
      let end = (index + 1) * chunksize;

      if (end >= file.length) end = file.length;

      const chunkBufferCipher = await encryptBuffer(file.slice(start, end));
      fs.writeSync(fd, chunkBufferCipher, 0, chunkBufferCipher.length, start);
    }
  });
};





/**
 * Decrypt file by chunks
 * @param {String} path The path of file
 * @param {number} [chunksize=3072] The size of chunks
 * @return {Promise<Array<Buffer>>} The buffer of chunks decrypted
 */
export const decryptFilesByChunks = async (path: any, chunksize: number = 3072): Promise<Array<Buffer>>=> {
  const fullBufferEncrypt = fs.readFileSync(path)
  const chunks = Math.ceil(fullBufferEncrypt.length / chunksize);

    let decryptedBuffer: Array<Buffer> = []
    for (let index = 0; index < chunks; index++) {
      const start = index * chunksize;
      let end = (index + 1) * chunksize;

      if (end >= fullBufferEncrypt.length) end = fullBufferEncrypt.length;
      const chunkBufferDecrypted =  decryptBuffer(fullBufferEncrypt.slice(start, end));
      decryptedBuffer = [...decryptedBuffer, chunkBufferDecrypted]
    }

    return decryptedBuffer
}



/**
 * Encrypt a chunk
 * @param {Buffer} chunk The chunk
 * @return {Promise<Buffer>}  The chunk encrypted
 */
export const encryptBuffer = async (chunk: Buffer): Promise<Buffer> => {
  let cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );
  let encrypted = cipher.update(chunk);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted;
};

/**
 * Decrypt a buffer
 * @param {Buffer} buffereEncrypted The buffer encrypted
 * @return {Buffer} Rhe chunk decrypted  
 */
export const decryptBuffer = (buffereEncrypted: Buffer): Buffer => {
  let decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );
  let decrypted = decipher.update(buffereEncrypted);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted;
}



/**
 * Decrypt a file
 * @param {String} path The path of file to decrypt
 * @return {Buffer}  The file decrypted 
 */
export const decryptFile = async (path: any): Promise<Buffer> => {
  const fileEncrypted = fs.readFileSync(path)
  let decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key,"base64"), Buffer.from(iv, "base64"));
  let decrypted = decipher.update(fileEncrypted);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted
}


