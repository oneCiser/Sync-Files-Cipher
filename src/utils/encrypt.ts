import crypto from "crypto"
import fs from "fs"

const ALGORITHM = "aes-256-cbc";

/**
 * Encrypt and save a file
 * 
 * @param {Buffer} file The file to encrypt
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {String} path The path of file
 * @return {Buffer}  The buffer encrypted
 */
export const encryptAndSaveFile = async (file: Buffer, path: any, key: string, iv: string): Promise<Buffer> => {
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
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {number} [chunksize=3072] The size of chunks
 */
export const encryptAndSaveChunk = (file: Buffer, path: any, key: string, iv: string, chunksize: number = 3072): void => {
  const chunks = Math.ceil(file.length / chunksize);

  fs.open(path, "w+", async function (err, fd) {
    for (let index = 0; index < chunks; index++) {
      const start = index * chunksize;
      let end = (index + 1) * chunksize;

      if (end >= file.length) end = file.length;

      const chunkBufferCipher = await encryptBuffer(file.slice(start, end), key, iv);
      fs.writeSync(fd, chunkBufferCipher, 0, chunkBufferCipher.length, start);
    }
  });
};





/**
 * Decrypt file by chunks
 * @param {String} path The path of file
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {number} [chunksize=3072] The size of chunks
 * @return {Promise<Array<Buffer>>} The buffer of chunks decrypted
 */
export const decryptFilesByChunks = async (path: any, key: string, iv: string, chunksize: number = 3072): Promise<Array<Buffer>>=> {
  const fullBufferEncrypt = fs.readFileSync(path)
  const chunks = Math.ceil(fullBufferEncrypt.length / chunksize);

    let decryptedBuffer: Array<Buffer> = []
    for (let index = 0; index < chunks; index++) {
      const start = index * chunksize;
      let end = (index + 1) * chunksize;

      if (end >= fullBufferEncrypt.length) end = fullBufferEncrypt.length;
      const chunkBufferDecrypted =  decryptBuffer(fullBufferEncrypt.slice(start, end), key, iv);
      decryptedBuffer = [...decryptedBuffer, chunkBufferDecrypted]
    }

    return decryptedBuffer
}



/**
 * Encrypt a chunk
 * @param {Buffer} chunk The chunk
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @return {Promise<Buffer>}  The chunk encrypted
 */
export const encryptBuffer = async (chunk: Buffer, key: string, iv: string): Promise<Buffer> => {
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
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @return {Buffer} Rhe chunk decrypted  
 */
export const decryptBuffer = (buffereEncrypted: Buffer, key: string, iv: string): Buffer => {
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
 * @param {string} key The key is the raw key used by the algorithm. Must be utf8 encoded string, see nodejs crypto for more details
 * @param {string} iv Is an initialization vector. Must be utf8 encoded string, see nodejs crypto for more details
 * @return {Buffer}  The file decrypted 
 */
export const decryptFile = async (path: any, key: string, iv: string): Promise<Buffer> => {
  const fileEncrypted = fs.readFileSync(path)
  let decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key,"base64"), Buffer.from(iv, "base64"));
  let decrypted = decipher.update(fileEncrypted);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted
}


