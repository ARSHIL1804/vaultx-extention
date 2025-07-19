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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryClient = void 0;
/* eslint-disable no-dupe-class-members, @typescript-eslint/ban-types, @typescript-eslint/naming-convention */
var ics23_1 = require("@confio/ics23");
var encoding_1 = require("@/packages/@cosmjs/encoding");
var stream_1 = require("@/packages/@cosmjs/stream");
var utils_1 = require("@/packages/@cosmjs/utils");
function checkAndParseOp(op, kind, key) {
    if (op.type !== kind) {
        throw new Error("Op expected to be ".concat(kind, ", got \"").concat(op.type));
    }
    if (!(0, utils_1.arrayContentEquals)(key, op.key)) {
        throw new Error("Proven key different than queried key.\nQuery: ".concat((0, encoding_1.toHex)(key), "\nProven: ").concat((0, encoding_1.toHex)(op.key)));
    }
    return ics23_1.ics23.CommitmentProof.decode(op.data);
}
var QueryClient = /** @class */ (function () {
    function QueryClient(cometClient) {
        this.cometClient = cometClient;
    }
    QueryClient.withExtensions = function (cometClient) {
        var extensionSetups = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            extensionSetups[_i - 1] = arguments[_i];
        }
        var client = new QueryClient(cometClient);
        var extensions = extensionSetups.map(function (setupExtension) { return setupExtension(client); });
        for (var _a = 0, extensions_1 = extensions; _a < extensions_1.length; _a++) {
            var extension = extensions_1[_a];
            (0, utils_1.assert)((0, utils_1.isNonNullObject)(extension), "Extension must be a non-null object");
            for (var _b = 0, _c = Object.entries(extension); _b < _c.length; _b++) {
                var _d = _c[_b], moduleKey = _d[0], moduleValue = _d[1];
                (0, utils_1.assert)((0, utils_1.isNonNullObject)(moduleValue), "Module must be a non-null object. Found type ".concat(typeof moduleValue, " for module \"").concat(moduleKey, "\"."));
                var current = client[moduleKey] || {};
                client[moduleKey] = __assign(__assign({}, current), moduleValue);
            }
        }
        return client;
    };
    /**
     * Queries the database store with a proof, which is then verified.
     *
     * Please note: the current implementation trusts block headers it gets from the PRC endpoint.
     */
    QueryClient.prototype.queryStoreVerified = function (store, queryKey, desiredHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, height, proof, key, value, subProof, storeProof, header;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.queryRawProof(store, queryKey, desiredHeight)];
                    case 1:
                        _a = _b.sent(), height = _a.height, proof = _a.proof, key = _a.key, value = _a.value;
                        subProof = checkAndParseOp(proof.ops[0], "ics23:iavl", queryKey);
                        storeProof = checkAndParseOp(proof.ops[1], "ics23:simple", (0, encoding_1.toAscii)(store));
                        // this must always be existence, if the store is not a typo
                        (0, utils_1.assert)(storeProof.exist);
                        (0, utils_1.assert)(storeProof.exist.value);
                        // this may be exist or non-exist, depends on response
                        if (!value || value.length === 0) {
                            // non-existence check
                            (0, utils_1.assert)(subProof.nonexist);
                            // the subproof must map the desired key to the "value" of the storeProof
                            (0, ics23_1.verifyNonExistence)(subProof.nonexist, ics23_1.iavlSpec, storeProof.exist.value, queryKey);
                        }
                        else {
                            // existence check
                            (0, utils_1.assert)(subProof.exist);
                            (0, utils_1.assert)(subProof.exist.value);
                            // the subproof must map the desired key to the "value" of the storeProof
                            (0, ics23_1.verifyExistence)(subProof.exist, ics23_1.iavlSpec, storeProof.exist.value, queryKey, value);
                        }
                        return [4 /*yield*/, this.getNextHeader(height)];
                    case 2:
                        header = _b.sent();
                        (0, ics23_1.verifyExistence)(storeProof.exist, ics23_1.tendermintSpec, header.appHash, (0, encoding_1.toAscii)(store), storeProof.exist.value);
                        return [2 /*return*/, { key: key, value: value, height: height }];
                }
            });
        });
    };
    QueryClient.prototype.queryRawProof = function (store, queryKey, desiredHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, key, value, height, proof, code, log;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.cometClient.abciQuery({
                            // we need the StoreKey for the module, not the module name
                            // https://github.com/cosmos/cosmos-sdk/blob/8cab43c8120fec5200c3459cbf4a92017bb6f287/x/auth/types/keys.go#L12
                            path: "/store/".concat(store, "/key"),
                            data: queryKey,
                            prove: true,
                            height: desiredHeight,
                        })];
                    case 1:
                        _a = _c.sent(), key = _a.key, value = _a.value, height = _a.height, proof = _a.proof, code = _a.code, log = _a.log;
                        if (code) {
                            throw new Error("Query failed with (".concat(code, "): ").concat(log));
                        }
                        if (!(0, utils_1.arrayContentEquals)(queryKey, key)) {
                            throw new Error("Response key ".concat((0, encoding_1.toHex)(key), " doesn't match query key ").concat((0, encoding_1.toHex)(queryKey)));
                        }
                        if (!height) {
                            throw new Error("No query height returned");
                        }
                        if (!proof || proof.ops.length !== 2) {
                            throw new Error("Expected 2 proof ops, got ".concat((_b = proof === null || proof === void 0 ? void 0 : proof.ops.length) !== null && _b !== void 0 ? _b : 0, ". Are you using stargate?"));
                        }
                        // we don't need the results, but we can ensure the data is the proper format
                        checkAndParseOp(proof.ops[0], "ics23:iavl", key);
                        checkAndParseOp(proof.ops[1], "ics23:simple", (0, encoding_1.toAscii)(store));
                        return [2 /*return*/, {
                                key: key,
                                value: value,
                                height: height,
                                // need to clone this: readonly input / writeable output
                                proof: {
                                    ops: __spreadArray([], proof.ops, true),
                                },
                            }];
                }
            });
        });
    };
    /**
     * Performs an ABCI query to Tendermint without requesting a proof.
     *
     * If the `desiredHeight` is set, a particular height is requested. Otherwise
     * the latest height is requested. The response contains the actual height of
     * the query.
     */
    QueryClient.prototype.queryAbci = function (path, request, desiredHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cometClient.abciQuery({
                            path: path,
                            data: request,
                            prove: false,
                            height: desiredHeight,
                        })];
                    case 1:
                        response = _a.sent();
                        if (response.code) {
                            throw new Error("Query failed with (".concat(response.code, "): ").concat(response.log));
                        }
                        if (!response.height) {
                            throw new Error("No query height returned");
                        }
                        return [2 /*return*/, {
                                value: response.value,
                                height: response.height,
                            }];
                }
            });
        });
    };
    // this must return the header for height+1
    // throws an error if height is 0 or undefined
    QueryClient.prototype.getNextHeader = function (height) {
        return __awaiter(this, void 0, void 0, function () {
            var searchHeight, nextHeader, headersSubscription, firstHeader, correctHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, utils_1.assertDefined)(height);
                        if (height === 0) {
                            throw new Error("Query returned height 0, cannot prove it");
                        }
                        searchHeight = height + 1;
                        try {
                            headersSubscription = this.cometClient.subscribeNewBlockHeader();
                        }
                        catch (_b) {
                            // Ignore exception caused by non-WebSocket Tendermint clients
                        }
                        if (!headersSubscription) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, stream_1.firstEvent)(headersSubscription)];
                    case 1:
                        firstHeader = _a.sent();
                        // The first header we get might not be n+1 but n+2 or even higher. In such cases we fall back on a query.
                        if (firstHeader.height === searchHeight) {
                            nextHeader = firstHeader;
                        }
                        _a.label = 2;
                    case 2:
                        if (!!nextHeader) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.cometClient.blockchain(height, searchHeight)];
                    case 3:
                        correctHeader = (_a.sent()).blockMetas
                            .map(function (meta) { return meta.header; })
                            .find(function (h) { return h.height === searchHeight; });
                        if (!correctHeader) return [3 /*break*/, 4];
                        nextHeader = correctHeader;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, (0, utils_1.sleep)(1000)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 2];
                    case 7:
                        (0, utils_1.assert)(nextHeader.height === searchHeight, "Got wrong header. This is a bug in the logic above.");
                        return [2 /*return*/, nextHeader];
                }
            });
        });
    };
    return QueryClient;
}());
exports.QueryClient = QueryClient;
//# sourceMappingURL=queryclient.js.map