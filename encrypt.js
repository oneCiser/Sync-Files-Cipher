const  crypto = require('crypto')
const  fs = require('fs')
const {
    randomFillSync,
    scryptSync
  } =  require('crypto');

const ALGORITHM = 'aes-256-cbc'
const PASSWORD = 'Password used to generate key'; 

// const key = scryptSync(PASSWORD, "salt", 32).toString("base64")
// const SALT = crypto.randomBytes(16).toString("hex")
// const iv = Buffer.alloc(16, 0); // Initialization vector.

const key = "8BZ3pCTp71LX5I//QsBYdz7w4JHXNVehSBXuXnScdqg="
const SALT = "079fd8121b76ddbc6c1493a3209f0b36"
const iv = "AAAAAAAAAAAAAAAAAAAAAA=="


//console.log("IV: ", iv.toString("base64"));
// console.log("IV: ", iv);
// console.log("SALT: ", SALT);
// console.log("KEY: ", key);


 const encryptAndSaveFile = async (file, path) => {
    
    let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key,"base64"), Buffer.from(iv, "base64"));
    let encrypted = cipher.update(file);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    fs.writeFileSync(path, encrypted)
    return encrypted

}

const encryptFile = async (file) => {
    
    let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key,"base64"), Buffer.from(iv, "base64"));
    let encrypted = cipher.update(file);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted

}

 const decryptFile = async (path) => {

    const fileEncrypted = fs.readFileSync(path)
    let decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key,"base64"), Buffer.from(iv, "base64"));
    let decrypted = decipher.update(fileEncrypted);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted
}

// const fileToEncrypet = fs.readFileSync("./files/original.txt")
// encryptAndSaveFile(fileToEncrypet, "./fileEncrypted.txt")

// (async () => {
//     const fileDecrypted = await decryptFile("./fileEncrypted.txt")
//     console.log(fileDecrypted.toString("utf-8"));
// })()


module.exports = {decryptFile,encryptAndSaveFile,encryptFile};


