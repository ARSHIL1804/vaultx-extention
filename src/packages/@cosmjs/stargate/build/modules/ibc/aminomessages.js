"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAminoMsgTransfer = isAminoMsgTransfer;
exports.createIbcAminoConverters = createIbcAminoConverters;
/* eslint-disable @typescript-eslint/naming-convention */
var amino_1 = require("@/packages/@cosmjs/amino");
var tx_1 = require("cosmjs-types/ibc/applications/transfer/v1/tx");
function isAminoMsgTransfer(msg) {
    return msg.type === "cosmos-sdk/MsgTransfer";
}
function createIbcAminoConverters() {
    return {
        "/ibc.applications.transfer.v1.MsgTransfer": {
            aminoType: "cosmos-sdk/MsgTransfer",
            toAmino: function (_a) {
                var _b, _c, _d;
                var sourcePort = _a.sourcePort, sourceChannel = _a.sourceChannel, token = _a.token, sender = _a.sender, receiver = _a.receiver, timeoutHeight = _a.timeoutHeight, timeoutTimestamp = _a.timeoutTimestamp, memo = _a.memo;
                return ({
                    source_port: sourcePort,
                    source_channel: sourceChannel,
                    token: token,
                    sender: sender,
                    receiver: receiver,
                    timeout_height: timeoutHeight
                        ? {
                            revision_height: (_b = (0, amino_1.omitDefault)(timeoutHeight.revisionHeight)) === null || _b === void 0 ? void 0 : _b.toString(),
                            revision_number: (_c = (0, amino_1.omitDefault)(timeoutHeight.revisionNumber)) === null || _c === void 0 ? void 0 : _c.toString(),
                        }
                        : {},
                    timeout_timestamp: (_d = (0, amino_1.omitDefault)(timeoutTimestamp)) === null || _d === void 0 ? void 0 : _d.toString(),
                    memo: (0, amino_1.omitDefault)(memo),
                });
            },
            fromAmino: function (_a) {
                var source_port = _a.source_port, source_channel = _a.source_channel, token = _a.token, sender = _a.sender, receiver = _a.receiver, timeout_height = _a.timeout_height, timeout_timestamp = _a.timeout_timestamp, memo = _a.memo;
                return tx_1.MsgTransfer.fromPartial({
                    sourcePort: source_port,
                    sourceChannel: source_channel,
                    token: token,
                    sender: sender,
                    receiver: receiver,
                    timeoutHeight: timeout_height
                        ? {
                            revisionHeight: BigInt(timeout_height.revision_height || "0"),
                            revisionNumber: BigInt(timeout_height.revision_number || "0"),
                        }
                        : undefined,
                    timeoutTimestamp: BigInt(timeout_timestamp || "0"),
                    memo: memo !== null && memo !== void 0 ? memo : "",
                });
            },
        },
    };
}
//# sourceMappingURL=aminomessages.js.map