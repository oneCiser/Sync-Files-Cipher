import chokidar from 'chokidar';
import { logger } from '../utils/logger';
import { EventWatch } from '../types'


/**
 *
 * Watch a file or directory
 * @param {string} path Thr path to watch
 * @param {Function} handler The handler for exec when change files
 * @return {FSWatcher} The watcher
 */
export const watch = (path: string, handler: Function) => {
    logger.info("Watching: " + path);
    return chokidar.watch(path).on('all', (event, path) => {
        
        let eventType: string = '';

        if(event === 'add') eventType = EventWatch.ADD_FILE
        else if(event === 'addDir') eventType = EventWatch.ADD_DIR
        else if(event === 'unlinkDir') eventType = EventWatch.REMOVE_DIR
        else if(event === 'unlink') eventType = EventWatch.REMOVE_FILE
        else if(event === 'change') eventType = EventWatch.CHANGE
        
        handler(eventType, path.replace(/\\/g, '/'))
    });
}


