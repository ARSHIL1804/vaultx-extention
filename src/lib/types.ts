import { CURRENCIES, DAPP_REQUEST_TYPE, LANGAUGES, NETWORK, TRANSACTION_TYPE } from "./enums"


export interface Coin {
    denom:string
    amount:number,
    price?:number
}

export interface Token {
    name:string,
    contractAddress:string,
    balance:number,
    decimals: number,
    symbol:string,
    type:string
}



export interface Asset {
    denom:string,
    amount:number
}

export interface Activity {
    hash:string,
    addresses:string[],
    isEVM:boolean,
    evmHash:string | null,
    type:TRANSACTION_TYPE,
    block:string,
    timestamp:Date,
    asset:Asset[],
    commision:Asset,
    gasLimit: number,
    gasUsed: number,
    gasMax:number,
    nonce:string,
}

export interface Language{
    name:string,
    symbol:string,
}

export interface Currency{
    name:string,
    symbol:string,
    short:string
}



export interface Network {
    name: string,
    type: NETWORK,
    chainID: number;
    cosmosRpc: string,
    evmRpc: string,
    explorer: string,
}


export interface Settings {
    language:Language,
    currency:Currency,
    network:Network
}

export interface InputBox {
    value: string,
    isValid: boolean,
    error: string
}

export interface SiteMetaData {
    domain: string,
    favicon: string,
    name: string
}

export interface DappRequest {
    dappInfo: SiteMetaData,
    type: DAPP_REQUEST_TYPE,
    id: string,
    requestData: any
}

export class VaulXRequestError extends Error { 
    title: string;
    message: string;
    errordCode: string;
    
    constructor(title:string, message:string, errorCode:string){
        super(message);
        this.title = title;
        this.message = message;
        this.errordCode = errorCode;
    }
    
    setMessage(message){
        this.message = message;
    }

}

export interface DomainPermission {
    mainNetPermission: boolean
}

export interface AccountPermission {
    domainsPermision : DomainPermission[]
}

export interface TransactionPayload {
    contractAddress: string,
    contractABI: any,
    functionName: string,
    functionParams: any,
    transferAmount: string
}