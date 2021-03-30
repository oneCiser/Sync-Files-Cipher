"use strict";
exports.__esModule = true;
exports.Action = void 0;
var Action;
(function (Action) {
    Action[Action["COMPARE_ROLLINGS"] = 0] = "COMPARE_ROLLINGS";
    Action[Action["STREAM_BUFFERS"] = 1] = "STREAM_BUFFERS";
    Action[Action["PREPARE_STREAM"] = 2] = "PREPARE_STREAM";
    Action[Action["CLOSE_CONNECTION"] = 3] = "CLOSE_CONNECTION";
    Action[Action["STREAM_START"] = 4] = "STREAM_START";
    Action[Action["REMOVE_FILE"] = 5] = "REMOVE_FILE";
    Action[Action["REMOVE_DIR"] = 6] = "REMOVE_DIR";
    Action[Action["ADD_DIR"] = 7] = "ADD_DIR";
    Action[Action["ADD_FILE"] = 8] = "ADD_FILE";
    Action[Action["MOVE"] = 9] = "MOVE";
    Action[Action["ERROR"] = 10] = "ERROR";
})(Action = exports.Action || (exports.Action = {}));
