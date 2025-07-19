import { APP_CONTANTS } from "@/lib/constants";
import { NATIVE_TOKEN } from "@/lib/enums";
import { formatTokenBalanceToDisplay } from "@/lib/utils";
import { AccountInfromation } from "@/providers/AccountProvider";
import { SigningStargateClient } from "@cosmjs/stargate";

export class AccountService {
  private activeAccount: AccountInfromation;
  public xfi
  constructor(activeAccount: AccountInfromation) {
    this.activeAccount = activeAccount;
  }

  async getTokenBalances(rpc: string) {
    const client = await SigningStargateClient.connect(rpc);
    const coins = await client.getAllBalances(
      this.activeAccount.newWallet.address
    );
    let tokens = [];
    for (let coin of coins) {
      if (coin?.denom === APP_CONTANTS.XFI) {
        tokens.push({
          denom: coin?.denom,
          balance: formatTokenBalanceToDisplay(Number(coin?.amount)),
        });
      } else if (coin?.denom === APP_CONTANTS.MPX) {
        tokens.push({
          denom: coin?.denom,
          balance: formatTokenBalanceToDisplay(Number(coin?.amount)),
        });
      }
    }
    return tokens;
  }
}
