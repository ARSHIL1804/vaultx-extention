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
exports.isAminoMsgCreateVestingAccount = isAminoMsgCreateVestingAccount;
exports.createVestingAminoConverters = createVestingAminoConverters;
function isAminoMsgCreateVestingAccount(msg) {
    return msg.type === "cosmos-sdk/MsgCreateVestingAccount";
}
function createVestingAminoConverters() {
    return {
        "/cosmos.vesting.v1beta1.MsgCreateVestingAccount": {
            aminoType: "cosmos-sdk/MsgCreateVestingAccount",
            toAmino: function (_a) {
                var fromAddress = _a.fromAddress, toAddress = _a.toAddress, amount = _a.amount, endTime = _a.endTime, delayed = _a.delayed;
                return ({
                    from_address: fromAddress,
                    to_address: toAddress,
                    amount: __spreadArray([], amount, true),
                    end_time: endTime.toString(),
                    delayed: delayed,
                });
            },
            fromAmino: function (_a) {
                var from_address = _a.from_address, to_address = _a.to_address, amount = _a.amount, end_time = _a.end_time, delayed = _a.delayed;
                return ({
                    fromAddress: from_address,
                    toAddress: to_address,
                    amount: __spreadArray([], amount, true),
                    endTime: BigInt(end_time),
                    delayed: delayed,
                });
            },
        },
    };
}
//# sourceMappingURL=aminomessages.js.map