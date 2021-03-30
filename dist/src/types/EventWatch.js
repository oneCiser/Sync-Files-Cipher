"use strict";
exports.__esModule = true;
exports.EventWatch = void 0;
var EventWatch;
(function (EventWatch) {
    EventWatch[EventWatch["ADD_DIR"] = 0] = "ADD_DIR";
    EventWatch[EventWatch["ADD_FILE"] = 1] = "ADD_FILE";
    EventWatch[EventWatch["REMOVE_DIR"] = 2] = "REMOVE_DIR";
    EventWatch[EventWatch["REMOVE_FILE"] = 3] = "REMOVE_FILE";
    EventWatch[EventWatch["CHANGE"] = 4] = "CHANGE";
    EventWatch[EventWatch["MOVE"] = 5] = "MOVE";
})(EventWatch = exports.EventWatch || (exports.EventWatch = {}));
