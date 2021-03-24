const fs = require('fs');



const getChanges = (changes,  buffer) => {
    let bufferChanges = {};
    for (let i = 0; i < changes.length; i++) {
        let start = changes[i].start;
        let end = changes[i].end;
        if(end >= buffer.length) end = buffer.length;
        let subBuffer = buffer.slice(start, end);
        bufferChanges[changes[i].start] = subBuffer.toString('base64');
        

        
    }
    // {
    //     start: buffer64
    // }
    return bufferChanges;
}

module.exports = {getChanges};

