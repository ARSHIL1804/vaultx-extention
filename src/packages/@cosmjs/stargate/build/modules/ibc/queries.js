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
exports.setupIbcExtension = setupIbcExtension;
/* eslint-disable @typescript-eslint/naming-convention */
var encoding_1 = require("@/packages/@cosmjs/encoding");
var math_1 = require("@/packages/@cosmjs/math");
var query_1 = require("cosmjs-types/ibc/applications/transfer/v1/query");
var channel_1 = require("cosmjs-types/ibc/core/channel/v1/channel");
var query_2 = require("cosmjs-types/ibc/core/channel/v1/query");
var query_3 = require("cosmjs-types/ibc/core/client/v1/query");
var query_4 = require("cosmjs-types/ibc/core/connection/v1/query");
var tendermint_1 = require("cosmjs-types/ibc/lightclients/tendermint/v1/tendermint");
var queryclient_1 = require("../../queryclient");
function decodeTendermintClientStateAny(clientState) {
    if ((clientState === null || clientState === void 0 ? void 0 : clientState.typeUrl) !== "/ibc.lightclients.tendermint.v1.ClientState") {
        throw new Error("Unexpected client state type: ".concat(clientState === null || clientState === void 0 ? void 0 : clientState.typeUrl));
    }
    return tendermint_1.ClientState.decode(clientState.value);
}
function decodeTendermintConsensusStateAny(clientState) {
    if ((clientState === null || clientState === void 0 ? void 0 : clientState.typeUrl) !== "/ibc.lightclients.tendermint.v1.ConsensusState") {
        throw new Error("Unexpected client state type: ".concat(clientState === null || clientState === void 0 ? void 0 : clientState.typeUrl));
    }
    return tendermint_1.ConsensusState.decode(clientState.value);
}
function setupIbcExtension(base) {
    var _this = this;
    var rpc = (0, queryclient_1.createProtobufRpcClient)(base);
    // Use these services to get easy typed access to query methods
    // These cannot be used for proof verification
    var channelQueryService = new query_2.QueryClientImpl(rpc);
    var clientQueryService = new query_3.QueryClientImpl(rpc);
    var connectionQueryService = new query_4.QueryClientImpl(rpc);
    var transferQueryService = new query_1.QueryClientImpl(rpc);
    return {
        ibc: {
            channel: {
                channel: function (portId, channelId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.Channel({
                                portId: portId,
                                channelId: channelId,
                            })];
                    });
                }); },
                channels: function (paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.Channels({
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                    });
                }); },
                allChannels: function () { return __awaiter(_this, void 0, void 0, function () {
                    var channels, response, key;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                channels = [];
                                _b.label = 1;
                            case 1: return [4 /*yield*/, channelQueryService.Channels({
                                    pagination: (0, queryclient_1.createPagination)(key),
                                })];
                            case 2:
                                response = _b.sent();
                                channels.push.apply(channels, response.channels);
                                key = (_a = response.pagination) === null || _a === void 0 ? void 0 : _a.nextKey;
                                _b.label = 3;
                            case 3:
                                if (key && key.length) return [3 /*break*/, 1];
                                _b.label = 4;
                            case 4: return [2 /*return*/, query_2.QueryChannelsResponse.fromPartial({
                                    channels: channels,
                                    height: response.height,
                                })];
                        }
                    });
                }); },
                connectionChannels: function (connection, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.ConnectionChannels({
                                connection: connection,
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                    });
                }); },
                allConnectionChannels: function (connection) { return __awaiter(_this, void 0, void 0, function () {
                    var channels, response, key;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                channels = [];
                                _b.label = 1;
                            case 1: return [4 /*yield*/, channelQueryService.ConnectionChannels({
                                    connection: connection,
                                    pagination: (0, queryclient_1.createPagination)(key),
                                })];
                            case 2:
                                response = _b.sent();
                                channels.push.apply(channels, response.channels);
                                key = (_a = response.pagination) === null || _a === void 0 ? void 0 : _a.nextKey;
                                _b.label = 3;
                            case 3:
                                if (key && key.length) return [3 /*break*/, 1];
                                _b.label = 4;
                            case 4: return [2 /*return*/, query_2.QueryConnectionChannelsResponse.fromPartial({
                                    channels: channels,
                                    height: response.height,
                                })];
                        }
                    });
                }); },
                clientState: function (portId, channelId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.ChannelClientState({
                                portId: portId,
                                channelId: channelId,
                            })];
                    });
                }); },
                consensusState: function (portId, channelId, revisionNumber, revisionHeight) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.ChannelConsensusState({
                                portId: portId,
                                channelId: channelId,
                                revisionNumber: BigInt(revisionNumber),
                                revisionHeight: BigInt(revisionHeight),
                            })];
                    });
                }); },
                packetCommitment: function (portId, channelId, sequence) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.PacketCommitment({
                                portId: portId,
                                channelId: channelId,
                                sequence: (0, queryclient_1.longify)(sequence),
                            })];
                    });
                }); },
                packetCommitments: function (portId, channelId, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.PacketCommitments({
                                channelId: channelId,
                                portId: portId,
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                    });
                }); },
                allPacketCommitments: function (portId, channelId) { return __awaiter(_this, void 0, void 0, function () {
                    var commitments, response, key;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                commitments = [];
                                _b.label = 1;
                            case 1: return [4 /*yield*/, channelQueryService.PacketCommitments({
                                    channelId: channelId,
                                    portId: portId,
                                    pagination: (0, queryclient_1.createPagination)(key),
                                })];
                            case 2:
                                response = _b.sent();
                                commitments.push.apply(commitments, response.commitments);
                                key = (_a = response.pagination) === null || _a === void 0 ? void 0 : _a.nextKey;
                                _b.label = 3;
                            case 3:
                                if (key && key.length) return [3 /*break*/, 1];
                                _b.label = 4;
                            case 4: return [2 /*return*/, query_2.QueryPacketCommitmentsResponse.fromPartial({
                                    commitments: commitments,
                                    height: response.height,
                                })];
                        }
                    });
                }); },
                packetReceipt: function (portId, channelId, sequence) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.PacketReceipt({
                                portId: portId,
                                channelId: channelId,
                                sequence: (0, queryclient_1.longify)(sequence),
                            })];
                    });
                }); },
                packetAcknowledgement: function (portId, channelId, sequence) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.PacketAcknowledgement({
                                portId: portId,
                                channelId: channelId,
                                sequence: (0, queryclient_1.longify)(sequence),
                            })];
                    });
                }); },
                packetAcknowledgements: function (portId, channelId, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                    var request;
                    return __generator(this, function (_a) {
                        request = query_2.QueryPacketAcknowledgementsRequest.fromPartial({
                            portId: portId,
                            channelId: channelId,
                            pagination: (0, queryclient_1.createPagination)(paginationKey),
                        });
                        return [2 /*return*/, channelQueryService.PacketAcknowledgements(request)];
                    });
                }); },
                allPacketAcknowledgements: function (portId, channelId) { return __awaiter(_this, void 0, void 0, function () {
                    var acknowledgements, response, key, request;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                acknowledgements = [];
                                _b.label = 1;
                            case 1:
                                request = query_2.QueryPacketAcknowledgementsRequest.fromPartial({
                                    channelId: channelId,
                                    portId: portId,
                                    pagination: (0, queryclient_1.createPagination)(key),
                                });
                                return [4 /*yield*/, channelQueryService.PacketAcknowledgements(request)];
                            case 2:
                                response = _b.sent();
                                acknowledgements.push.apply(acknowledgements, response.acknowledgements);
                                key = (_a = response.pagination) === null || _a === void 0 ? void 0 : _a.nextKey;
                                _b.label = 3;
                            case 3:
                                if (key && key.length) return [3 /*break*/, 1];
                                _b.label = 4;
                            case 4: return [2 /*return*/, query_2.QueryPacketAcknowledgementsResponse.fromPartial({
                                    acknowledgements: acknowledgements,
                                    height: response.height,
                                })];
                        }
                    });
                }); },
                unreceivedPackets: function (portId, channelId, packetCommitmentSequences) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.UnreceivedPackets({
                                portId: portId,
                                channelId: channelId,
                                packetCommitmentSequences: packetCommitmentSequences.map(function (s) { return BigInt(s); }),
                            })];
                    });
                }); },
                unreceivedAcks: function (portId, channelId, packetAckSequences) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.UnreceivedAcks({
                                portId: portId,
                                channelId: channelId,
                                packetAckSequences: packetAckSequences.map(function (s) { return BigInt(s); }),
                            })];
                    });
                }); },
                nextSequenceReceive: function (portId, channelId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, channelQueryService.NextSequenceReceive({
                                portId: portId,
                                channelId: channelId,
                            })];
                    });
                }); },
            },
            client: {
                state: function (clientId) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, clientQueryService.ClientState({ clientId: clientId })];
                }); }); },
                states: function (paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, clientQueryService.ClientStates({
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                    });
                }); },
                allStates: function () { return __awaiter(_this, void 0, void 0, function () {
                    var clientStates, response, key;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                clientStates = [];
                                _b.label = 1;
                            case 1: return [4 /*yield*/, clientQueryService.ClientStates({
                                    pagination: (0, queryclient_1.createPagination)(key),
                                })];
                            case 2:
                                response = _b.sent();
                                clientStates.push.apply(clientStates, response.clientStates);
                                key = (_a = response.pagination) === null || _a === void 0 ? void 0 : _a.nextKey;
                                _b.label = 3;
                            case 3:
                                if (key && key.length) return [3 /*break*/, 1];
                                _b.label = 4;
                            case 4: return [2 /*return*/, query_3.QueryClientStatesResponse.fromPartial({
                                    clientStates: clientStates,
                                })];
                        }
                    });
                }); },
                consensusState: function (clientId, consensusHeight) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, clientQueryService.ConsensusState(query_3.QueryConsensusStateRequest.fromPartial({
                                clientId: clientId,
                                revisionHeight: consensusHeight !== undefined ? BigInt(consensusHeight) : undefined,
                                latestHeight: consensusHeight === undefined,
                            }))];
                    });
                }); },
                consensusStates: function (clientId, paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, clientQueryService.ConsensusStates({
                                clientId: clientId,
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                    });
                }); },
                allConsensusStates: function (clientId) { return __awaiter(_this, void 0, void 0, function () {
                    var consensusStates, response, key;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                consensusStates = [];
                                _b.label = 1;
                            case 1: return [4 /*yield*/, clientQueryService.ConsensusStates({
                                    clientId: clientId,
                                    pagination: (0, queryclient_1.createPagination)(key),
                                })];
                            case 2:
                                response = _b.sent();
                                consensusStates.push.apply(consensusStates, response.consensusStates);
                                key = (_a = response.pagination) === null || _a === void 0 ? void 0 : _a.nextKey;
                                _b.label = 3;
                            case 3:
                                if (key && key.length) return [3 /*break*/, 1];
                                _b.label = 4;
                            case 4: return [2 /*return*/, query_3.QueryConsensusStatesResponse.fromPartial({
                                    consensusStates: consensusStates,
                                })];
                        }
                    });
                }); },
                params: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, clientQueryService.ClientParams({})];
                }); }); },
                stateTm: function (clientId) { return __awaiter(_this, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, clientQueryService.ClientState({ clientId: clientId })];
                            case 1:
                                response = _a.sent();
                                return [2 /*return*/, decodeTendermintClientStateAny(response.clientState)];
                        }
                    });
                }); },
                statesTm: function (paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                    var clientStates;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, clientQueryService.ClientStates({
                                    pagination: (0, queryclient_1.createPagination)(paginationKey),
                                })];
                            case 1:
                                clientStates = (_a.sent()).clientStates;
                                return [2 /*return*/, clientStates.map(function (_a) {
                                        var clientState = _a.clientState;
                                        return decodeTendermintClientStateAny(clientState);
                                    })];
                        }
                    });
                }); },
                allStatesTm: function () { return __awaiter(_this, void 0, void 0, function () {
                    var clientStates, response, key;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                clientStates = [];
                                _b.label = 1;
                            case 1: return [4 /*yield*/, clientQueryService.ClientStates({
                                    pagination: (0, queryclient_1.createPagination)(key),
                                })];
                            case 2:
                                response = _b.sent();
                                clientStates.push.apply(clientStates, response.clientStates);
                                key = (_a = response.pagination) === null || _a === void 0 ? void 0 : _a.nextKey;
                                _b.label = 3;
                            case 3:
                                if (key && key.length) return [3 /*break*/, 1];
                                _b.label = 4;
                            case 4: return [2 /*return*/, clientStates.map(function (_a) {
                                    var clientState = _a.clientState;
                                    return decodeTendermintClientStateAny(clientState);
                                })];
                        }
                    });
                }); },
                consensusStateTm: function (clientId, consensusHeight) { return __awaiter(_this, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, clientQueryService.ConsensusState(query_3.QueryConsensusStateRequest.fromPartial({
                                    clientId: clientId,
                                    revisionHeight: consensusHeight === null || consensusHeight === void 0 ? void 0 : consensusHeight.revisionHeight,
                                    revisionNumber: consensusHeight === null || consensusHeight === void 0 ? void 0 : consensusHeight.revisionNumber,
                                    latestHeight: consensusHeight === undefined,
                                }))];
                            case 1:
                                response = _a.sent();
                                return [2 /*return*/, decodeTendermintConsensusStateAny(response.consensusState)];
                        }
                    });
                }); },
            },
            connection: {
                connection: function (connectionId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, connectionQueryService.Connection({
                                connectionId: connectionId,
                            })];
                    });
                }); },
                connections: function (paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, connectionQueryService.Connections({
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                    });
                }); },
                allConnections: function () { return __awaiter(_this, void 0, void 0, function () {
                    var connections, response, key;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                connections = [];
                                _b.label = 1;
                            case 1: return [4 /*yield*/, connectionQueryService.Connections({
                                    pagination: (0, queryclient_1.createPagination)(key),
                                })];
                            case 2:
                                response = _b.sent();
                                connections.push.apply(connections, response.connections);
                                key = (_a = response.pagination) === null || _a === void 0 ? void 0 : _a.nextKey;
                                _b.label = 3;
                            case 3:
                                if (key && key.length) return [3 /*break*/, 1];
                                _b.label = 4;
                            case 4: return [2 /*return*/, query_4.QueryConnectionsResponse.fromPartial({
                                    connections: connections,
                                    height: response.height,
                                })];
                        }
                    });
                }); },
                clientConnections: function (clientId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, connectionQueryService.ClientConnections({
                                clientId: clientId,
                            })];
                    });
                }); },
                clientState: function (connectionId) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, connectionQueryService.ConnectionClientState({
                                connectionId: connectionId,
                            })];
                    });
                }); },
                consensusState: function (connectionId, revisionHeight) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, connectionQueryService.ConnectionConsensusState(query_4.QueryConnectionConsensusStateRequest.fromPartial({
                                connectionId: connectionId,
                                revisionHeight: BigInt(revisionHeight),
                            }))];
                    });
                }); },
            },
            transfer: {
                denomTrace: function (hash) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, transferQueryService.DenomTrace({ hash: hash })];
                }); }); },
                denomTraces: function (paginationKey) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, transferQueryService.DenomTraces({
                                pagination: (0, queryclient_1.createPagination)(paginationKey),
                            })];
                    });
                }); },
                allDenomTraces: function () { return __awaiter(_this, void 0, void 0, function () {
                    var denomTraces, response, key;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                denomTraces = [];
                                _b.label = 1;
                            case 1: return [4 /*yield*/, transferQueryService.DenomTraces({
                                    pagination: (0, queryclient_1.createPagination)(key),
                                })];
                            case 2:
                                response = _b.sent();
                                denomTraces.push.apply(denomTraces, response.denomTraces);
                                key = (_a = response.pagination) === null || _a === void 0 ? void 0 : _a.nextKey;
                                _b.label = 3;
                            case 3:
                                if (key && key.length) return [3 /*break*/, 1];
                                _b.label = 4;
                            case 4: return [2 /*return*/, query_1.QueryDenomTracesResponse.fromPartial({
                                    denomTraces: denomTraces,
                                })];
                        }
                    });
                }); },
                params: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, transferQueryService.Params({})];
                }); }); },
            },
            verified: {
                channel: {
                    channel: function (portId, channelId) { return __awaiter(_this, void 0, void 0, function () {
                        var key, value;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    key = (0, encoding_1.toAscii)("channelEnds/ports/".concat(portId, "/channels/").concat(channelId));
                                    return [4 /*yield*/, base.queryStoreVerified("ibc", key)];
                                case 1:
                                    value = (_a.sent()).value;
                                    return [2 /*return*/, value.length ? channel_1.Channel.decode(value) : null];
                            }
                        });
                    }); },
                    packetCommitment: function (portId, channelId, sequence) { return __awaiter(_this, void 0, void 0, function () {
                        var key, value;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    key = (0, encoding_1.toAscii)("commitments/ports/".concat(portId, "/channels/").concat(channelId, "/packets/").concat(sequence));
                                    return [4 /*yield*/, base.queryStoreVerified("ibc", key)];
                                case 1:
                                    value = (_a.sent()).value;
                                    // keeper code doesn't parse, but returns raw
                                    return [2 /*return*/, value];
                            }
                        });
                    }); },
                    packetAcknowledgement: function (portId, channelId, sequence) { return __awaiter(_this, void 0, void 0, function () {
                        var key, value;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    key = (0, encoding_1.toAscii)("acks/ports/".concat(portId, "/channels/").concat(channelId, "/acknowledgements/").concat(sequence));
                                    return [4 /*yield*/, base.queryStoreVerified("ibc", key)];
                                case 1:
                                    value = (_a.sent()).value;
                                    // keeper code doesn't parse, but returns raw
                                    return [2 /*return*/, value];
                            }
                        });
                    }); },
                    nextSequenceReceive: function (portId, channelId) { return __awaiter(_this, void 0, void 0, function () {
                        var key, value;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    key = (0, encoding_1.toAscii)("seqAcks/ports/".concat(portId, "/channels/").concat(channelId, "/nextSequenceAck"));
                                    return [4 /*yield*/, base.queryStoreVerified("ibc", key)];
                                case 1:
                                    value = (_a.sent()).value;
                                    return [2 /*return*/, value.length ? math_1.Uint64.fromBytes(value).toNumber() : null];
                            }
                        });
                    }); },
                },
            },
        },
    };
}
//# sourceMappingURL=queries.js.map