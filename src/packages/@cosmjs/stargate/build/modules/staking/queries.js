"use strict";
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
exports.setupStakingExtension = setupStakingExtension;
/* eslint-disable @typescript-eslint/naming-convention */
var query_1 = require("cosmjs-types/cosmos/staking/v1beta1/query");
var queryclient_1 = require("../../queryclient");
function setupStakingExtension(base) {
    var _this = this;
    // Use this service to get easy typed access to query methods
    // This cannot be used for proof verification
    var rpc = (0, queryclient_1.createProtobufRpcClient)(base);
    var queryService = new query_1.QueryClientImpl(rpc);
    return {
        staking: {
            delegation: function (delegatorAddress, validatorAddress) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.Delegation({
                                delegatorAddr: delegatorAddress,
                                validatorAddr: validatorAddress,
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            delegatorDelegations: function (delegatorAddress, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.DelegatorDelegations({
                                delegatorAddr: delegatorAddress,
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            delegatorUnbondingDelegations: function (delegatorAddress, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.DelegatorUnbondingDelegations({
                                delegatorAddr: delegatorAddress,
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            delegatorValidator: function (delegatorAddress, validatorAddress) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.DelegatorValidator({
                                delegatorAddr: delegatorAddress,
                                validatorAddr: validatorAddress,
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            delegatorValidators: function (delegatorAddress, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.DelegatorValidators({
                                delegatorAddr: delegatorAddress,
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            historicalInfo: function (height) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.HistoricalInfo({
                                height: BigInt(height),
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            params: function () { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.Params({})];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            pool: function () { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.Pool({})];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            redelegations: function (delegatorAddress, sourceValidatorAddress, destinationValidatorAddress, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.Redelegations({
                                delegatorAddr: delegatorAddress,
                                srcValidatorAddr: sourceValidatorAddress,
                                dstValidatorAddr: destinationValidatorAddress,
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            unbondingDelegation: function (delegatorAddress, validatorAddress) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.UnbondingDelegation({
                                delegatorAddr: delegatorAddress,
                                validatorAddr: validatorAddress,
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            validator: function (validatorAddress) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.Validator({ validatorAddr: validatorAddress })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            validatorDelegations: function (validatorAddress, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.ValidatorDelegations({
                                validatorAddr: validatorAddress,
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            validators: function (status, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.Validators({
                                status: status,
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
            validatorUnbondingDelegations: function (validatorAddress, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, queryService.ValidatorUnbondingDelegations({
                                validatorAddr: validatorAddress,
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            }); },
        },
    };
}
//# sourceMappingURL=queries.js.map