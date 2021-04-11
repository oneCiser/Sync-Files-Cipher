"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.watch = void 0;
var chokidar_1 = __importDefault(require("chokidar"));
var logger_1 = require("../utils/logger");
var types_1 = require("../types");
/**
 *
 * Watch a file or directory
 * @param {string} path Thr path to watch
 * @param {Function} handler The handler for exec when change files
 * @return {FSWatcher} The watcher
 */
var watch = function (path, handler) {
    logger_1.logger.info("Watching: " + path);
    return chokidar_1["default"].watch(path, {
        awaitWriteFinish: true
    }).on('all', function (event, path) {
        var eventType = '';
        if (event === 'add')
            eventType = types_1.EventWatch.SYNC;
        else if (event === 'addDir')
            eventType = types_1.EventWatch.ADD_DIR;
        else if (event === 'unlinkDir')
            eventType = types_1.EventWatch.REMOVE_DIR;
        else if (event === 'unlink')
            eventType = types_1.EventWatch.REMOVE_FILE;
        else if (event === 'change')
            eventType = types_1.EventWatch.SYNC;
        handler(eventType, path.replace(/\\/g, '/'));
    });
};
exports.watch = watch;
