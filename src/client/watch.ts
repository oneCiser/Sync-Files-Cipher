import chokidar from 'chokidar';
import { EventWatch } from '../types'


/**
 *
 * Watch a file or directory
 * @param {string} path Thr path to watch
 * @param {Function} handler The handler for exec when change files
 * @return {FSWatcher} The watcher
 */
export const watch = (path: string, handler: Function) => {
    console.log("Watching: ", path);
    
    return chokidar.watch(path, {ignoreInitial:true}).on('all', (event, path) => {
        
        let eventType: number = 0;

        if(event === 'add') eventType = EventWatch.ADD_FILE
        else if(event === 'addDir') eventType = EventWatch.ADD_DIR
        else if(event === 'unlinkDir') eventType = EventWatch.REMOVE_DIR
        else if(event === 'unlink') eventType = EventWatch.REMOVE_FILE
        else if(event === 'change') eventType = EventWatch.CHANGE
        else if(event === 'move') eventType = EventWatch.MOVE
        
        handler(eventType, path)
    });
}


