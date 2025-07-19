"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAttribute = parseAttribute;
exports.parseEvent = parseEvent;
exports.parseLog = parseLog;
exports.parseLogs = parseLogs;
exports.parseRawLog = parseRawLog;
exports.findAttribute = findAttribute;
/* eslint-disable @typescript-eslint/naming-convention */
var utils_1 = require("@/packages/@cosmjs/utils");
function parseAttribute(input) {
    if (!(0, utils_1.isNonNullObject)(input))
        throw new Error("Attribute must be a non-null object");
    var _a = input, key = _a.key, value = _a.value;
    if (typeof key !== "string" || !key)
        throw new Error("Attribute's key must be a non-empty string");
    if (typeof value !== "string" && typeof value !== "undefined") {
        throw new Error("Attribute's value must be a string or unset");
    }
    return {
        key: key,
        value: value || "",
    };
}
function parseEvent(input) {
    if (!(0, utils_1.isNonNullObject)(input))
        throw new Error("Event must be a non-null object");
    var _a = input, type = _a.type, attributes = _a.attributes;
    if (typeof type !== "string" || type === "") {
        throw new Error("Event type must be a non-empty string");
    }
    if (!Array.isArray(attributes))
        throw new Error("Event's attributes must be an array");
    return {
        type: type,
        attributes: attributes.map(parseAttribute),
    };
}
function parseLog(input) {
    if (!(0, utils_1.isNonNullObject)(input))
        throw new Error("Log must be a non-null object");
    var _a = input, msg_index = _a.msg_index, log = _a.log, events = _a.events;
    if (typeof msg_index !== "number")
        throw new Error("Log's msg_index must be a number");
    if (typeof log !== "string")
        throw new Error("Log's log must be a string");
    if (!Array.isArray(events))
        throw new Error("Log's events must be an array");
    return {
        msg_index: msg_index,
        log: log,
        events: events.map(parseEvent),
    };
}
function parseLogs(input) {
    if (!Array.isArray(input))
        throw new Error("Logs must be an array");
    return input.map(parseLog);
}
function parseRawLog(input) {
    // Cosmos SDK >= 0.50 gives us an empty string here. This should be handled like undefined.
    if (!input)
        return [];
    var logsToParse = JSON.parse(input).map(function (_a, i) {
        var events = _a.events;
        return ({
            msg_index: i,
            events: events,
            log: "",
        });
    });
    return parseLogs(logsToParse);
}
/**
 * Searches in logs for the first event of the given event type and in that event
 * for the first first attribute with the given attribute key.
 *
 * Throws if the attribute was not found.
 */
function findAttribute(logs, eventType, attrKey) {
    var _a;
    var firstLogs = logs.find(function () { return true; });
    var out = (_a = firstLogs === null || firstLogs === void 0 ? void 0 : firstLogs.events.find(function (event) { return event.type === eventType; })) === null || _a === void 0 ? void 0 : _a.attributes.find(function (attr) { return attr.key === attrKey; });
    if (!out) {
        throw new Error("Could not find attribute '".concat(attrKey, "' in first event of type '").concat(eventType, "' in first log."));
    }
    return out;
}
//# sourceMappingURL=logs.js.map