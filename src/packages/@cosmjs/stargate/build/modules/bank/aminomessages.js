"use strict";
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
exports.isAminoMsgSend = isAminoMsgSend;
exports.isAminoMsgMultiSend = isAminoMsgMultiSend;
exports.createBankAminoConverters = createBankAminoConverters;
function isAminoMsgSend(msg) {
    return msg.type === "cosmos-sdk/MsgSend";
}
function isAminoMsgMultiSend(msg) {
    return msg.type === "cosmos-sdk/MsgMultiSend";
}
function createBankAminoConverters() {
    return {
        "/cosmos.bank.v1beta1.MsgSend": {
            aminoType: "cosmos-sdk/MsgSend",
            toAmino: function (_a) {
                var fromAddress = _a.fromAddress, toAddress = _a.toAddress, amount = _a.amount;
                return ({
                    from_address: fromAddress,
                    to_address: toAddress,
                    amount: __spreadArray([], amount, true),
                });
            },
            fromAmino: function (_a) {
                var from_address = _a.from_address, to_address = _a.to_address, amount = _a.amount;
                return ({
                    fromAddress: from_address,
                    toAddress: to_address,
                    amount: __spreadArray([], amount, true),
                });
            },
        },
        "/cosmos.bank.v1beta1.MsgMultiSend": {
            aminoType: "cosmos-sdk/MsgMultiSend",
            toAmino: function (_a) {
                var inputs = _a.inputs, outputs = _a.outputs;
                return ({
                    inputs: inputs.map(function (input) { return ({
                        address: input.address,
                        coins: __spreadArray([], input.coins, true),
                    }); }),
                    outputs: outputs.map(function (output) { return ({
                        address: output.address,
                        coins: __spreadArray([], output.coins, true),
                    }); }),
                });
            },
            fromAmino: function (_a) {
                var inputs = _a.inputs, outputs = _a.outputs;
                return ({
                    inputs: inputs.map(function (input) { return ({
                        address: input.address,
                        coins: __spreadArray([], input.coins, true),
                    }); }),
                    outputs: outputs.map(function (output) { return ({
                        address: output.address,
                        coins: __spreadArray([], output.coins, true),
                    }); }),
                });
            },
        },
    };
}
//# sourceMappingURL=aminomessages.js.map