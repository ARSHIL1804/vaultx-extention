import { GasPrice } from "@cosmjs/stargate"
import { VaulXRequestError } from "./types";
import { ERROR_CODE, NETWORK } from "./enums";


export const APP_CONTANTS =
{
  USER_WALLETS_KEY: process.env.NEXT_PUBLIC_KEY_PREFIX + "-user-wallets",
  USER_ACTIVE_WALLET_KEY: process.env.NEXT_PUBLIC_KEY_PREFIX + "-user-active-wallet",
  WALLET_PASSWORD_KEY: process.env.NEXT_PUBLIC_KEY_PREFIX + "-wallet-password",
  LAST_AUTH_TIME_KEY: process.env.NEXT_PUBLIC_KEY_PREFIX + "-last-auth-time",
  WALLET_SETTINGS: process.env.NEXT_PUBLIC_KEY_PREFIX + "-wallet-settings",


  ACCOUNT_NAME_PREFIX: "Account",
  NETWORKS: {
    TESTNET: {
      name: 'Testnet',
      chainID: 4157,
      cosmosRpc: 'https://rpc-t.crossfi.nodestake.org/',
      evmRpc: 'https://rpc.testnet.ms/',
      explorer: 'https://test.xfiscan.com/',
      type: NETWORK.TESTNET
    },
    MAINNET: {
      name: 'MainNet',
      chainID: 4158,
      cosmosRpc: 'https://rpc.crossfi.nodestake.org/',
      evmRpc: 'https://rpc.mainnet.ms/',
      explorer: 'https://xfiscan.com/',
      type: NETWORK.MAINNET
    }
  },
  LANGAUGES: {
    EN: {
      name: 'English',
      symbol: 'en'
    },
    FR: {
      name: 'French',
      symbol: 'fr'
    },
    SP: {
      name: 'Spanish',
      symbol: 'es'
    },
  },

  CURRENCIES: {
    USD: {
      name: 'United States Doller',
      short: 'USD',
      symbol: '$'
    },
    INR: {
      name: 'Indian Ruppe',
      short: 'INR',
      symbol: '₹'
    }
  },
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 12,

  RE_AUTHENTICATION_TIME: 1800000 * 1000,  // in secs
  COSMOS_HD_PATH: "m/44'/118'/0'/0/0",
  ETHEREUM_HD_PATH: "m/44'/60'/0'/0/0",

  MPX_PRICE: 0.02,
  CRYPTO_PRICE: "https://min-api.cryptocompare.com/data/price",
  TOKEN_BACKGROUND_COLOR: ["#6e4648", "#6e5946", "#5c466e", "#465f6e", "#506e46"],
  GAS_LIMIT_COEF: 1.4,
  SIGNING_CLIENT_OPTION: {
    broadcastTimeoutMs: 5e3,
    broadcastPollIntervalMs: 1e3,
    gasPrice: GasPrice.fromString("100000000000xfi")
  },
  CRYPTO_KEY: "!z%C*F-JaNdRgUkXn2r5u8x/A?D(G+Kb",
  XFI: "xfi",
  MPX: "mpx",
  DECIMAL: 18,
  DECIMAL_EXP: BigInt(10 ** 18),
  TXS_TYPE_URL: {
    ONVERT_COIN: "/crossfi.erc20.v1.MsgConvertCoin",
    DELEGATE: "/cosmos.staking.v1beta1.MsgDelegate",
    DEPOSIT: "/cosmos.gov.v1beta1.MsgDeposit",
    MULTISEND: "/cosmos.bank.v1beta1.MsgMultiSend",
    REDELEGATE: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
    REWARD: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
    SUBMIT_PROPOSAL: "/cosmos.gov.v1beta1.MsgSubmitProposal",
    TRANSFER: "/cosmos.bank.v1beta1.MsgSend",
    UNDELEGATE: "/cosmos.staking.v1beta1.MsgUndelegate",
    VOTE: "/cosmos.gov.v1beta1.MsgVote"
  },
  COSMOS_ADDRESS_PREFIXES: {
    prefix_norm: 'mx1',
    prefix_val: 'mxvaloper'
  }

}


export const API_CONSTANTS = {
  CRYPTO_PRICE: "https://min-api.cryptocompare.com/data/price",
  RPC_URL: "https://crossfi-testnet-rpc.itrocket.net:443",

  TESTNET_XFI_SCAN_URL: 'https://test.xfiscan.com/api/1.0',
  MAINNET_XFI_SCAN_URL: 'https://xfiscan.com/api/1.0',
  XFI_SCAN_APIs: {
    TOKEN_HOLDERS: '/token-holders',
    TRANSACTIONS: '/txs',
    ADDRESSES: '/addresses'
  }
}




export const STORAGE_KEYS = {

  VaultXPermittedDomains: 'vaultxPermittedDomains',
  WALLET_STATE: 'wallet-state',
  ACCOUNTS: 'accounts',
  SELECTED_ACCOUNT: 'selectedAccount'
}


export const VaultXErrorTypes = Object.freeze({
  INTERNAL_ERROR: new VaulXRequestError(
    "Server Error",
    "Internal Error",
    ERROR_CODE.E001
  ),
  NO_ACCOUNTS: new VaulXRequestError(
    "No Accounts",
    "No accounts found",
    ERROR_CODE.E002
  ),
  TIME_OUT: new VaulXRequestError(
    "Time out",
    "The prompt timed out without a response. This could be because the user did not respond or because a new request was opened.",
    ERROR_CODE.E003
  ),
  UNAUTHORIZED: new VaulXRequestError(
    "Unauthorized",
    "The requested method and/or account has not been authorized by the user.",
    ERROR_CODE.E004
    ,
  ),
  UNSUPPORTED: new VaulXRequestError(
    "Unsupported Request",
    "The provider does not support the requested method.",
    ERROR_CODE.E005

  ),
  USER_REJECTION: new VaulXRequestError(
    "User Rejected",
    "The user rejected the request",
    ERROR_CODE.E006

  ),
  TRANSACTION_ERROR: new VaulXRequestError(
    "Transaction Error",
    "There is an unknown error in initiating transaction",
    ERROR_CODE.E007
  ),
  INSUFFICIENT_BALANCE: new VaulXRequestError(
    "Insufficient Balance",
    "Insufficient balance in currenct selected account",
    ERROR_CODE.E008
  ),

});