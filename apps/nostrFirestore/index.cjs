"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var nostr_tools_1 = require("nostr-tools");
var fs_1 = require("fs");
global.WebSocket = require('ws');
var csv = require('csv-parser');
var admin = require("firebase-admin");
var serviceAccount = require("./firebase-admin.json");
var MOST_RECENT_EVENT_FILE = 'mostRecentEvent.txt';
function getMostRecentEventFromFile() {
    return __awaiter(this, void 0, void 0, function () {
        var content, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readFile(MOST_RECENT_EVENT_FILE, 'utf-8')];
                case 1:
                    content = _a.sent();
                    return [2 /*return*/, parseInt(content.trim(), 10)];
                case 2:
                    error_1 = _a.sent();
                    console.log('Error reading mostRecentEvent file. Defaulting to Date.now().', error_1);
                    return [2 /*return*/, Date.now()];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function saveMostRecentEventToFile(value) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.writeFile(MOST_RECENT_EVENT_FILE, value.toString(), 'utf-8')];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.log('Error writing to mostRecentEvent file.', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function sanitizeKeyForFirestore(key) {
    return key.trim()
        .replace(/\s+/g, '__') // Replace all whitespace sequences with double underscores
        .replace(/[.$#[\]/]/g, '_') // Replace forbidden characters with underscores
        .replace(/^\.*|\.*$/g, '') // Ensure the key doesn't start or end with a dot
        .toLowerCase();
}
function createFirestoreKey(key, value, delineator) {
    if (delineator === void 0) { delineator = '---'; }
    if (key.length != 1)
        throw new Error("Key must be a single character");
    if (value.length > 500)
        throw new Error("Value must be less than 500 characters");
    return key + delineator + sanitizeKeyForFirestore(value);
}
function mapEventToFirestore(event) {
    var tags = event.tags, eventWithoutTags = __rest(event, ["tags"]);
    var searchTags = {};
    for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
        var _a = tags_1[_i], key = _a[0], value = _a[1];
        try {
            var firestoreKey = createFirestoreKey(key, value);
            searchTags[firestoreKey] = true;
        }
        catch (e) {
            continue;
        }
    }
    return __assign(__assign({}, eventWithoutTags), { searchTags: searchTags, stringifiedEvent: JSON.stringify(event) });
}
function uploadBatchedEvents(db, events) {
    return __awaiter(this, void 0, void 0, function () {
        var batch, _i, events_1, event_1, eventRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    batch = db.batch();
                    for (_i = 0, events_1 = events; _i < events_1.length; _i++) {
                        event_1 = events_1[_i];
                        eventRef = db.doc("events/".concat(event_1.id));
                        batch.set(eventRef, event_1, { merge: true });
                    }
                    return [4 /*yield*/, batch.commit()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var relaySub;
var relay;
var mostRecentEvent;
function runServer() {
    return __awaiter(this, void 0, void 0, function () {
        var tries, fails, timeout, db, startTime, data, mappedData, endTime, timeDifference, averageEventsPerSecond, e_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tries = 50;
                    fails = 0;
                    timeout = 30000;
                    console.log("Connecting to firestore...");
                    db = admin.firestore();
                    return [4 /*yield*/, getMostRecentEventFromFile()];
                case 1:
                    mostRecentEvent = _a.sent();
                    console.log("Connecting to relay...");
                    relay = (0, nostr_tools_1.relayInit)('wss://relay.primal.net');
                    return [4 /*yield*/, relay.connect()];
                case 2:
                    _a.sent();
                    relaySub = relay.sub([]);
                    relaySub.on('event', function (event) { return __awaiter(_this, void 0, void 0, function () {
                        var mappedEvent;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    mappedEvent = mapEventToFirestore(event);
                                    return [4 /*yield*/, uploadBatchedEvents(db, [mappedEvent])];
                                case 1:
                                    _a.sent();
                                    console.log("Uploaded event", mappedEvent.id);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 12];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 7, , 11]);
                    startTime = Date.now();
                    return [4 /*yield*/, relay.list([
                            {
                                limit: 500,
                                until: mostRecentEvent,
                                since: 0,
                            }
                        ])];
                case 5:
                    data = _a.sent();
                    mappedData = data.map(mapEventToFirestore);
                    mappedData.sort(function (a, b) { return a.created_at - b.created_at; });
                    return [4 /*yield*/, uploadBatchedEvents(db, mappedData)];
                case 6:
                    _a.sent();
                    endTime = Date.now();
                    timeDifference = (endTime - startTime) / 1000;
                    averageEventsPerSecond = mappedData.length / timeDifference;
                    if (mappedData.length == 0)
                        throw new Error("No events found!");
                    mostRecentEvent = mappedData[0].created_at;
                    console.log("".concat(mostRecentEvent, ": Uploaded ").concat(mappedData.length, " events in ").concat(timeDifference.toFixed(2), " seconds for an average of ").concat(averageEventsPerSecond.toFixed(2), "/s"));
                    fails = 1;
                    return [3 /*break*/, 11];
                case 7:
                    e_1 = _a.sent();
                    fails++;
                    if (!(--tries < 0)) return [3 /*break*/, 8];
                    console.log(e_1);
                    cleanup();
                    return [3 /*break*/, 12];
                case 8:
                    console.log(e_1);
                    console.log("Retrying in ".concat(timeout * fails / 1000, " seconds..."));
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, timeout * fails); })];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 3];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function cleanup() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    relaySub.unsub();
                    relay.close();
                    console.log("Last event:", mostRecentEvent);
                    return [4 /*yield*/, saveMostRecentEventToFile(mostRecentEvent)];
                case 1:
                    _a.sent();
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('\nReceived SIGINT (ctrl+c). Initiating cleanup...');
                return [4 /*yield*/, cleanup()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// runServer();
// ----------- TESTS -----------
function runTest() {
    return __awaiter(this, void 0, void 0, function () {
        var tagToSearch, db, eventsRef, querySnapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tagToSearch = createFirestoreKey('t', 'nsfw');
                    db = admin.firestore();
                    eventsRef = db.collection('events');
                    return [4 /*yield*/, eventsRef.where("searchTags.".concat(tagToSearch), '==', true).get()];
                case 1:
                    querySnapshot = _a.sent();
                    // const querySnapshot = await eventsRef.where(`kind`, '==', 9735).get();
                    if (querySnapshot.empty) {
                        console.log('No matching documents found.');
                        return [2 /*return*/];
                    }
                    console.log("\nFound ".concat(querySnapshot.size, " matching documents for tag ").concat(tagToSearch));
                    querySnapshot.forEach(function (doc) {
                        console.log(doc.id);
                    });
                    console.log("Found ".concat(querySnapshot.size, " matching documents for tag ").concat(tagToSearch, "\n"));
                    return [2 /*return*/];
            }
        });
    });
}
runTest();
