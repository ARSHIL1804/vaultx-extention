import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";
import { formatUnits, parseUnits } from 'viem'
import { API_CONSTANTS, APP_CONTANTS } from "./constants";
import { NETWORK, TRANSACTION_TYPE } from "./enums";
import { Asset, Network } from "./types";
import {Uint53} from '@cosmjs/math'
import { Coin, GasPrice } from "@cosmjs/stargate";
import converter from "bech32-converting";
import { AES, enc } from "crypto-js";
import { normalizeBech32 } from '@cosmjs/encoding'

export const one = 1;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function calculateFee(gas, garPrice:GasPrice) : {
  amount: Coin[],
  
}{
  const calculatedGas = Math.round(gas * APP_CONTANTS.GAS_LIMIT_COEF);
  const a =  garPrice.amount.multiply(new Uint53(calculatedGas)).ceil().toString();

  return {
    amount:a,
    gas:gas
  }

}


export function jsonParse(value:string){
  return JSON.parse(value);
}

export function jsonStringify(value:any){
  return JSON.stringify(value);
}


export function isValidNumber(value){
  const strValue = String(value).trim();
  const numberRegex = /^-?(\d+\.?\d*|\.\d+)$/;
  if (numberRegex.test(strValue) && Number.isFinite(parseFloat(strValue))) {
    return strValue !== '.';
  }
  return false;
}
export function isNullOrUndefined(value: any) {
  return value === null || value === undefined;
}

export function shortenAddress(address:string){
  return address.slice(0,5) + "..." + address.slice(35)
} 

export function getEVMAddress (cosmosAddress:string){
  if(!isValidCrossFIAddress(cosmosAddress))throw 'Invalid Cosmos Address'
  return converter('mx').toHex(cosmosAddress)
}



export function getFormatedDate(date:Date){
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if(date.toDateString() == today.toDateString()){
    return 'Today'
  }
  else if(date.toDateString() == yesterday.toDateString()){
    return 'Yesterday'
  }
  else{
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}



export function getTransactionType(tx:any, accountAddress:string){
  const addresses = tx.addresses;
  const bodyMessages = tx?.body?.messages;
  if(bodyMessages){
    if(!isNullOrUndefined(bodyMessages[0]?.data)){
      if(bodyMessages[0]?.data.input){
        return bodyMessages[0]?.data.input?.methodName || '';
      }
      else if(bodyMessages[0]?.data.data){
        return TRANSACTION_TYPE.CONTRACT_CALL
      }
      else{
        return TRANSACTION_TYPE.SEND;
      }
    }
    else if(tx.addresses.length>4){
      return TRANSACTION_TYPE.MULTISEND;
    }
    else if(tx.addresses[0] === accountAddress || tx.addresses[1] === accountAddress){
      return TRANSACTION_TYPE.SEND;
    }
    else{
      return TRANSACTION_TYPE.RECEIVE;
    }
  }
  return TRANSACTION_TYPE.UNKNOWN;
}


export function getTransactionAsset(tx:any){
  const bodyMessage = tx?.body?.messages[0];
  const asset:Asset = {
    denom:APP_CONTANTS.XFI,
    amount:0
  }
  if(bodyMessage?.data?.value){
    asset.amount = bodyMessage?.data?.value;
    console.log('here: ',asset)
    return asset;
  }
  else{
    return bodyMessage?.amount || asset;
  }
}


export function isEVMAddress(address:string){
  return address.match(/^0x[a-fA-F0-9]{40}$/) !== null;
}


export function isValidCrossFIAddress(address:string){
  try {
    return normalizeBech32(address).startsWith(APP_CONTANTS.COSMOS_ADDRESS_PREFIXES.prefix_norm) ;
  } catch (error) {
    return false;     
  }
}

export function isValidCrossFIValidatorAddress(address:string){
  return normalizeBech32(address).startsWith(APP_CONTANTS.COSMOS_ADDRESS_PREFIXES.prefix_val) ;
}


export const encrypt = (data:string, password:string) => {
  const ciphertext = AES.encrypt(data, password).toString();
  return ciphertext;
};

export const decrypt = (data:string, password:string) => {
  const bytes = AES.decrypt(data, password);
  const originalText = bytes.toString(enc.Utf8);
  return originalText;
};


export function formatTokenBalance(balance:number, decimals = APP_CONTANTS.DECIMAL){
  return (balance / Math.pow(10,decimals))
}

export function formatTokenBalanceToDisplay(balance:number, decimals = APP_CONTANTS.DECIMAL){
  return (balance / Math.pow(10,decimals)).toFixed(2)
}

export function formatTokenTotalBalance(balance:number,price:number){
  if(balance == null || price == null){
    return 0;
  }
  return formatTokenBalance(balance) * price;
}

export function formatTokenTotalBalanceToDisplay(balance:number,price:number){
  if(balance == null || price == null){
    return 0;
  }
  return (formatTokenBalance(balance) * price).toFixed(2);
}

export class BalanceFormater { 
  public static formatTokenBalance(balance:number, decimals = APP_CONTANTS.DECIMAL){
    return (balance / Math.pow(10,decimals))
  }
}


export class NumberFormatter {
  static parseUnits(value, decimals=APP_CONTANTS.DECIMAL) {
      return parseUnits(this.normalizeUserInput(value, decimals), decimals);
  }

  static formatUnits(value, decimals=APP_CONTANTS.DECIMAL) {
      const bigIntValue = this.toBigInt(String(value));
      return formatUnits(bigIntValue, decimals);
  }

  static toBigInt(value) {
      const [integerPart] = String(value).split('.');
      try {
          return BigInt(integerPart);
      } catch {
          return BigInt(0);
      }
  }

  static normalizeUserInput(value, decimals=APP_CONTANTS.DECIMAL) {
      const input = (value?.trim() || '');
      if (!Number(input)) return '0';

      const [intPart, fracPart] = input.split('.');
      const normalizedInt = BigInt(intPart.slice(0, 256)).toString();

      if (!fracPart) return normalizedInt;
      if (!decimals || fracPart.length <= decimals) {
          return this.deleteTrailingZero(`${normalizedInt}.${fracPart}`);
      }

      const result = this.deleteTrailingZero(
          `${normalizedInt}.${fracPart.slice(0, decimals)}`
      );
      return Number(result) ? result : '0';
  }

  static deleteTrailingZero(value) {
      const [intPart, fracPart] = value.split('.');
      if (!fracPart || !Number(fracPart)) return intPart;

      let cleanedFrac = fracPart;
      while (cleanedFrac.endsWith('0')) {
          cleanedFrac = cleanedFrac.slice(0, -1);
      }
      return `${intPart}.${cleanedFrac}`;
  }

  static formatToDisplay(value, options = {}) {
      const defaults = {
          minFractionalLength: 2,
          maxFractionalLength: 6,
          thousandsStep: ' ',
          withTrailingDots: false
      };
      const config = { ...defaults, ...options };

      const [intPart, fracPart] = this.normalizeUserInput(value).split('.');
      const formattedInt = config.thousandsStep !== undefined 
          ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsStep) 
          : intPart;

      if (!fracPart || !Number(fracPart)) {
          return config.minFractionalLength 
              ? `${formattedInt}.${'0'.repeat(config.minFractionalLength)}` 
              : formattedInt;
      }

      const truncatedFrac = fracPart.slice(0, config.maxFractionalLength);
      if (truncatedFrac.length < config.minFractionalLength) {
          return `${formattedInt}.${truncatedFrac.padEnd(config.minFractionalLength, '0')}`;
      }

      return fracPart.length > truncatedFrac.length && config.withTrailingDots
          ? `${formattedInt}.${truncatedFrac}...`
          : `${formattedInt}.${truncatedFrac}`;
  }

  static formatUnitsToDisplay(value,decimals=APP_CONTANTS.DECIMAL) {
      return this.formatToDisplay(
          this.formatUnits(value,decimals)
      );
  }
}

export function isEmpty(obj:any) {
  return Object.entries(obj).length === 0;
}

export function getXFIScanURL(network: Network) {
  return network.type === NETWORK.TESTNET ? API_CONSTANTS.TESTNET_XFI_SCAN_URL : API_CONSTANTS.MAINNET_XFI_SCAN_URL ; 
}