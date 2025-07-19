"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StargateClient = exports.BroadcastTxError = exports.TimeoutError = void 0;
exports.isDeliverTxFailure = isDeliverTxFailure;
exports.isDeliverTxSuccess = isDeliverTxSuccess;
exports.assertIsDeliverTxSuccess = assertIsDeliverTxSuccess;
exports.assertIsDeliverTxFailure = assertIsDeliverTxFailure;
/* eslint-disable @typescript-eslint/naming-convention */
var amino_1 = require("@/packages/@cosmjs/amino");
var encoding_1 = require("@/packages/@cosmjs/encoding");
var math_1 = require("@/packages/@cosmjs/math");
var tendermint_rpc_1 = require("@/packages/@cosmjs/tendermint-rpc");
var utils_1 = require("@/packages/@cosmjs/utils");
var abci_1 = require("cosmjs-types/cosmos/base/abci/v1beta1/abci");
var accounts_1 = require("./accounts");
var events_1 = require("./events");
var modules_1 = require("./modules");
var queryclient_1 = require("./queryclient");
var search_1 = require("./search");
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError(message, txId) {
        var _this = _super.call(this, message) || this;
        _this.txId = txId;
        return _this;
    }
    return TimeoutError;
}(Error));
exports.TimeoutError = TimeoutError;
function isDeliverTxFailure(result) {
    return !!result.code;
}
function isDeliverTxSuccess(result) {
    return !isDeliverTxFailure(result);
}
/**
 * Ensures the given result is a success. Throws a detailed error message otherwise.
 */
function assertIsDeliverTxSuccess(result) {
    if (isDeliverTxFailure(result)) {
        throw new Error("Error when broadcasting tx ".concat(result.transactionHash, " at height ").concat(result.height, ". Code: ").concat(result.code, "; Raw log: ").concat(result.rawLog));
    }
}
/**
 * Ensures the given result is a failure. Throws a detailed error message otherwise.
 */
function assertIsDeliverTxFailure(result) {
    if (isDeliverTxSuccess(result)) {
        throw new Error("Transaction ".concat(result.transactionHash, " did not fail at height ").concat(result.height, ". Code: ").concat(result.code, "; Raw log: ").concat(result.rawLog));
    }
}
/**
 * An error when broadcasting the transaction. This contains the CheckTx errors
 * from the blockchain. Once a transaction is included in a block no BroadcastTxError
 * is thrown, even if the execution fails (DeliverTx errors).
 */
var BroadcastTxError = /** @class */ (function (_super) {
    __extends(BroadcastTxError, _super);
    function BroadcastTxError(code, codespace, log) {
        var _this = _super.call(this, "Broadcasting transaction failed with code ".concat(code, " (codespace: ").concat(codespace, "). Log: ").concat(log)) || this;
        _this.code = code;
        _this.codespace = codespace;
        _this.log = log;
        return _this;
    }
    return BroadcastTxError;
}(Error));
exports.BroadcastTxError = BroadcastTxError;
var StargateClient = /** @class */ (function () {
    function StargateClient(cometClient, options) {
        if (cometClient) {
            this.cometClient = cometClient;
            this.queryClient = queryclient_1.QueryClient.withExtensions(cometClient, modules_1.setupAuthExtension, modules_1.setupBankExtension, modules_1.setupStakingExtension, modules_1.setupTxExtension);
        }
        var _a = options.accountParser, accountParser = _a === void 0 ? accounts_1.accountFromAny : _a;
        this.accountParser = accountParser;
    }
    /**
     * Creates an instance by connecting to the given CometBFT RPC endpoint.
     *
     * This uses auto-detection to decide between a CometBFT 0.38, Tendermint 0.37 and 0.34 client.
     * To set the Comet client explicitly, use `create`.
     */
    StargateClient.connect = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, options) {
            var cometClient;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, tendermint_rpc_1.connectComet)(endpoint)];
                    case 1:
                        cometClient = _a.sent();
                        return [2 /*return*/, StargateClient.create(cometClient, options)];
                }
            });
        });
    };
    /**
     * Creates an instance from a manually created Comet client.
     * Use this to use `Comet38Client` or `Tendermint37Client` instead of `Tendermint34Client`.
     */
    StargateClient.create = function (cometClient_1) {
        return __awaiter(this, arguments, void 0, function (cometClient, options) {
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                return [2 /*return*/, new StargateClient(cometClient, options)];
            });
        });
    };
    StargateClient.prototype.getCometClient = function () {
        return this.cometClient;
    };
    StargateClient.prototype.forceGetCometClient = function () {
        if (!this.cometClient) {
            throw new Error("Comet client not available. You cannot use online functionality in offline mode.");
        }
        return this.cometClient;
    };
    StargateClient.prototype.getQueryClient = function () {
        return this.queryClient;
    };
    StargateClient.prototype.forceGetQueryClient = function () {
        if (!this.queryClient) {
            throw new Error("Query client not available. You cannot use online functionality in offline mode.");
        }
        return this.queryClient;
    };
    StargateClient.prototype.getChainId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, chainId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.chainId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.forceGetCometClient().status()];
                    case 1:
                        response = _a.sent();
                        chainId = response.nodeInfo.network;
                        if (!chainId)
                            throw new Error("Chain ID must not be empty");
                        this.chainId = chainId;
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.chainId];
                }
            });
        });
    };
    StargateClient.prototype.getHeight = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.forceGetCometClient().status()];
                    case 1:
                        status = _a.sent();
                        return [2 /*return*/, status.syncInfo.latestBlockHeight];
                }
            });
        });
    };
    StargateClient.prototype.getAccount = function (searchAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var account, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.forceGetQueryClient().auth.account(searchAddress)];
                    case 1:
                        account = _a.sent();
                        return [2 /*return*/, account ? this.accountParser(account) : null];
                    case 2:
                        error_1 = _a.sent();
                        if (/rpc error: code = NotFound/i.test(error_1.toString())) {
                            return [2 /*return*/, null];
                        }
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StargateClient.prototype.getSequence = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAccount(address)];
                    case 1:
                        account = _a.sent();
                        if (!account) {
                            throw new Error("Account '".concat(address, "' does not exist on chain. Send some tokens there before trying to query sequence."));
                        }
                        return [2 /*return*/, {
                                accountNumber: account.accountNumber,
                                sequence: account.sequence,
                            }];
                }
            });
        });
    };
    StargateClient.prototype.getBlock = function (height) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.forceGetCometClient().block(height)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                id: (0, encoding_1.toHex)(response.blockId.hash).toUpperCase(),
                                header: {
                                    version: {
                                        block: new math_1.Uint53(response.block.header.version.block).toString(),
                                        app: new math_1.Uint53(response.block.header.version.app).toString(),
                                    },
                                    height: response.block.header.height,
                                    chainId: response.block.header.chainId,
                                    time: (0, tendermint_rpc_1.toRfc3339WithNanoseconds)(response.block.header.time),
                                },
                                txs: response.block.txs,
                            }];
                }
            });
        });
    };
    StargateClient.prototype.getBalance = function (address, searchDenom) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.forceGetQueryClient().bank.balance(address, searchDenom)];
            });
        });
    };
    /**
     * Queries all balances for all denoms that belong to this address.
     *
     * Uses the grpc queries (which iterates over the store internally), and we cannot get
     * proofs from such a method.
     */
    StargateClient.prototype.getAllBalances = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.forceGetQueryClient().bank.allBalances(address)];
            });
        });
    };
    StargateClient.prototype.getBalanceStaked = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var allDelegations, startAtKey, _a, delegationResponses, pagination, loadedDelegations, sumValues;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        allDelegations = [];
                        startAtKey = undefined;
                        _b.label = 1;
                    case 1: return [4 /*yield*/, this.forceGetQueryClient().staking.delegatorDelegations(address, startAtKey)];
                    case 2:
                        _a = _b.sent(), delegationResponses = _a.delegationResponses, pagination = _a.pagination;
                        loadedDelegations = delegationResponses || [];
                        allDelegations.push.apply(allDelegations, loadedDelegations);
                        startAtKey = pagination === null || pagination === void 0 ? void 0 : pagination.nextKey;
                        _b.label = 3;
                    case 3:
                        if (startAtKey !== undefined && startAtKey.length !== 0) return [3 /*break*/, 1];
                        _b.label = 4;
                    case 4:
                        sumValues = allDelegations.reduce(function (previousValue, currentValue) {
                            // Safe because field is set to non-nullable (https://github.com/cosmos/cosmos-sdk/blob/v0.45.3/proto/cosmos/staking/v1beta1/staking.proto#L295)
                            (0, utils_1.assert)(currentValue.balance);
                            return previousValue !== null ? (0, amino_1.addCoins)(previousValue, currentValue.balance) : currentValue.balance;
                        }, null);
                        return [2 /*return*/, sumValues];
                }
            });
        });
    };
    StargateClient.prototype.getDelegation = function (delegatorAddress, validatorAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var delegatedAmount, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.forceGetQueryClient().staking.delegation(delegatorAddress, validatorAddress)];
                    case 1:
                        delegatedAmount = (_a = (_b.sent()).delegationResponse) === null || _a === void 0 ? void 0 : _a.balance;
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        if (e_1.toString().includes("key not found")) {
                            // ignore, `delegatedAmount` remains undefined
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, delegatedAmount || null];
                }
            });
        });
    };
    StargateClient.prototype.getTx = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.txsQuery("tx.hash='".concat(id, "'"))];
                    case 1:
                        results = _b.sent();
                        return [2 /*return*/, (_a = results[0]) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    StargateClient.prototype.searchTx = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var rawQuery;
            return __generator(this, function (_a) {
                if (typeof query === "string") {
                    rawQuery = query;
                }
                else if ((0, search_1.isSearchTxQueryArray)(query)) {
                    rawQuery = query
                        .map(function (t) {
                        // numeric values must not have quotes https://github.com/cosmos/cosmjs/issues/1462
                        if (typeof t.value === "string")
                            return "".concat(t.key, "='").concat(t.value, "'");
                        else
                            return "".concat(t.key, "=").concat(t.value);
                    })
                        .join(" AND ");
                }
                else {
                    throw new Error("Got unsupported query type. See CosmJS 0.31 CHANGELOG for API breaking changes here.");
                }
                return [2 /*return*/, this.txsQuery(rawQuery)];
            });
        });
    };
    StargateClient.prototype.disconnect = function () {
        if (this.cometClient)
            this.cometClient.disconnect();
    };
    /**
     * Broadcasts a signed transaction to the network and monitors its inclusion in a block.
     *
     * If broadcasting is rejected by the node for some reason (e.g. because of a CheckTx failure),
     * an error is thrown.
     *
     * If the transaction is not included in a block before the provided timeout, this errors with a `TimeoutError`.
     *
     * If the transaction is included in a block, a `DeliverTxResponse` is returned. The caller then
     * usually needs to check for execution success or failure.
     */
    StargateClient.prototype.broadcastTx = function (tx_1) {
        return __awaiter(this, arguments, void 0, function (tx, timeoutMs, pollIntervalMs) {
            var timedOut, txPollTimeout, pollForTx, transactionId;
            var _this = this;
            if (timeoutMs === void 0) { timeoutMs = 60000; }
            if (pollIntervalMs === void 0) { pollIntervalMs = 3000; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timedOut = false;
                        txPollTimeout = setTimeout(function () {
                            timedOut = true;
                        }, timeoutMs);
                        pollForTx = function (txId) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (timedOut) {
                                            throw new TimeoutError("Transaction with ID ".concat(txId, " was submitted but was not yet found on the chain. You might want to check later. There was a wait of ").concat(timeoutMs / 1000, " seconds."), txId);
                                        }
                                        return [4 /*yield*/, (0, utils_1.sleep)(pollIntervalMs)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, this.getTx(txId)];
                                    case 2:
                                        result = _a.sent();
                                        return [2 /*return*/, result
                                                ? {
                                                    code: result.code,
                                                    height: result.height,
                                                    txIndex: result.txIndex,
                                                    events: result.events,
                                                    rawLog: result.rawLog,
                                                    transactionHash: txId,
                                                    msgResponses: result.msgResponses,
                                                    gasUsed: result.gasUsed,
                                                    gasWanted: result.gasWanted,
                                                }
                                                : pollForTx(txId)];
                                }
                            });
                        }); };
                        return [4 /*yield*/, this.broadcastTxSync(tx)];
                    case 1:
                        transactionId = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                return pollForTx(transactionId).then(function (value) {
                                    clearTimeout(txPollTimeout);
                                    resolve(value);
                                }, function (error) {
                                    clearTimeout(txPollTimeout);
                                    reject(error);
                                });
                            })];
                }
            });
        });
    };
    /**
     * Broadcasts a signed transaction to the network without monitoring it.
     *
     * If broadcasting is rejected by the node for some reason (e.g. because of a CheckTx failure),
     * an error is thrown.
     *
     * If the transaction is broadcasted, a `string` containing the hash of the transaction is returned. The caller then
     * usually needs to check if the transaction was included in a block and was successful.
     *
     * @returns Returns the hash of the transaction
     */
    StargateClient.prototype.broadcastTxSync = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var broadcasted, transactionId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.forceGetCometClient().broadcastTxSync({ tx: tx })];
                    case 1:
                        broadcasted = _b.sent();
                        if (broadcasted.code) {
                            return [2 /*return*/, Promise.reject(new BroadcastTxError(broadcasted.code, (_a = broadcasted.codespace) !== null && _a !== void 0 ? _a : "", broadcasted.log))];
                        }
                        transactionId = (0, encoding_1.toHex)(broadcasted.hash).toUpperCase();
                        return [2 /*return*/, transactionId];
                }
            });
        });
    };
    StargateClient.prototype.txsQuery = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.forceGetCometClient().txSearchAll({ query: query })];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.txs.map(function (tx) {
                                var _a;
                                var txMsgData = abci_1.TxMsgData.decode((_a = tx.result.data) !== null && _a !== void 0 ? _a : new Uint8Array());
                                return {
                                    height: tx.height,
                                    txIndex: tx.index,
                                    hash: (0, encoding_1.toHex)(tx.hash).toUpperCase(),
                                    code: tx.result.code,
                                    events: tx.result.events.map(events_1.fromTendermintEvent),
                                    rawLog: tx.result.log || "",
                                    tx: tx.tx,
                                    msgResponses: txMsgData.msgResponses,
                                    gasUsed: tx.result.gasUsed,
                                    gasWanted: tx.result.gasWanted,
                                };
                            })];
                }
            });
        });
    };
    return StargateClient;
}());
exports.StargateClient = StargateClient;
//# sourceMappingURL=stargateclient.js.map