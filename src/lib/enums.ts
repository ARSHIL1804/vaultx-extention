export enum NATIVE_TOKEN{
    XFI="xfi",
    MPX="mpx"
}


export enum TRANSACTION_TYPE{
    SEND = "Send",
    RECEIVE = "Receive",
    MULTISEND = "Multisend",
    CONTRACT_CALL ="Contract Call",
    UNKNOWN = "Unknown"
}

export enum LANGAUGES {
    ENGLISH = "English"
}

export enum CURRENCIES {
    USD =  "USD",
    INR = "INR"
}


export enum ACCOUNT_TYPE {
    COSMOS = "COSMOS",
    EVM = "EVM"
}

export enum DAPP_REQUEST_TYPE {
    CONNECT = "connect",
    TRANSFER_TOKEN = "transfer-token",
    CALL_CONTRACT = "call-contract",
    SIGN_MESSAGE = "sign-message"
}

export enum NETWORK { 
    TESTNET,
    MAINNET
}


export enum REQUEST_STATUS { 
    Approved = "approved",
    Dismissed = "dismissed",
    Rejected = "rejected",
    Timeout = "timeout"
}

export enum ERROR_CODE {
  E001 = 'WalletInternalError',
  E002 = 'WalletNoAccountsError',
  E003 = 'WalletTimeoutError',
  E004 = 'WalletUnauthorizedError',
  E005 = 'WalletUnsupportedRequestError',
  E006 = 'WalletUserRejectionError',
  E007 = 'WalletTransferTokenError',
  E008 = 'WalletInsufficientFundsError',
}
