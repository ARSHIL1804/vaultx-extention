import { API_CONSTANTS, APP_CONTANTS } from "@/lib/constants";
import { NATIVE_TOKEN } from "@/lib/enums";
import { Network } from "@/lib/types";
import { getTransactionAsset, getTransactionType, getXFIScanURL } from "@/lib/utils";
import { CoinBalance } from "@/providers/AccountProvider";
import { Coin, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient, StdFee, calculateFee, defaultRegistryTypes } from "@cosmjs/stargate";
import { HttpBatchClient, Tendermint34Client, TendermintClient } from "@cosmjs/tendermint-rpc";
import { useCallback } from "react";

export class CosmosService {
  static instance = null;
  private readonly _signer: DirectSecp256k1HdWallet;
  private tmClient: TendermintClient;
  constructor(signer: DirectSecp256k1HdWallet) {
    this._signer = signer;
  }

  get signer() {
    return this._signer;
  }

  public async getAccounts() {
    const [oldWallet, newWallet] = await this.signer.getAccounts();
    console.log([oldWallet, newWallet]);
    return [oldWallet, newWallet];
  }
  public static getStargateClientOptions({gasCurrency}:{gasCurrency:NATIVE_TOKEN}){
    return {
      registery: defaultRegistryTypes,
      gasPrice: {
        [NATIVE_TOKEN.MPX]: GasPrice.fromString("10000000000000mpx") ,
        [NATIVE_TOKEN.XFI]: GasPrice.fromString("100000000000xfi") 
      }[gasCurrency],
      broadcastTimeoutMs: 6e4,
      broadcastPollIntervalMs: 2e3
    }
  }

  public async getTendermint34Client(rpc: string):Promise<TendermintClient> {
    if (!this.tmClient) {
      const httpClient = new HttpBatchClient(rpc, {dispatchInterval:150});
      this.tmClient = await Tendermint34Client.create(httpClient);
    }
    return this.tmClient;
  }
  


  public async createSigningStargateClient(gasCurrency = NATIVE_TOKEN.XFI) {
    try {
      if (!this.signer) {
        throw new Error("Signer are required");
      }
      const tmClient = await this.getTendermint34Client('');
      const newClient = await SigningStargateClient.createWithSigner(
        tmClient,
        this.signer,
        CosmosService.getStargateClientOptions({
          gasCurrency: gasCurrency
        })
      );
      return newClient;
    } catch (error) {
      console.error("Error creating signing stargate client:", error);
      throw error;
    }
  }

  public async getBalanceByCoins(address:string):Promise<CoinBalance>{
    const balances = await this.getBalances(address);
    const xfi = this.getCoinFromBalance(NATIVE_TOKEN.XFI,balances);
    const mpx =  this.getCoinFromBalance(NATIVE_TOKEN.MPX,balances);
    return{
      mpx,
      xfi
    }
  }

  public async getBalances(address:string):Promise<Coin[]>{
    const client = await this.createSigningStargateClient();
    return await this.getBalanceBase(client,address);
  }

  public async getBalanceBase(client:SigningStargateClient,address:string):Promise<Coin[]>{
    const coinBalances = await client.getAllBalances(address);

    let coinBalancesLocale = [...coinBalances];
    let hasXFI = coinBalancesLocale.filter((coin)=>coin.denom === NATIVE_TOKEN.XFI); 
    let hasMPX = coinBalancesLocale.filter((coin)=>coin.denom === NATIVE_TOKEN.MPX); 

    if(!hasXFI){
      coinBalancesLocale.push({
        denom:NATIVE_TOKEN.XFI,
        amount:"0"
      })
    }
    if(!hasMPX){
      coinBalancesLocale.push({
        denom:NATIVE_TOKEN.MPX,
        amount:"0"
      })
    }
    return coinBalancesLocale;
  }

  public getCoinFromBalance(denom:string, balances:any) {
    const matchingCoin = balances.find((coin:any) => {
        return coin.denom === denom;
    });
    return matchingCoin || {
        denom: denom,
        amount: "0"
    };
  }

  public async calculateFeeBase(address, message:any,) {
    const client = await this.createSigningStargateClient();
    const memo="";
    const simulate = await client.simulate(
      address,
      [
       message
      ],
      memo
    );
    console.log("SIMULTE: ", simulate)
    const gasPrice = CosmosService.getStargateClientOptions({gasCurrency:NATIVE_TOKEN.XFI}).gasPrice;
    const fee :StdFee = calculateFee(
      Math.round(simulate * APP_CONTANTS.GAS_LIMIT_COEF),
      gasPrice
    );

    return fee;
  }

  static async getTransactions(address:string, page, reset, network: Network){
    const res = await fetch(
      getXFIScanURL(network) +
        API_CONSTANTS.XFI_SCAN_APIs.TRANSACTIONS +
        `?address=${address}&page=${reset ? 1 : page}`
    );
    const data = await res.json();
    const transactionData =  data.docs.map((transaction: any) => {
      return {
        hash: transaction.hash,
        addresses: transaction.addresses,
        isEVM: transaction.isEVM,
        evmHash: transaction.isEVM ? transaction.body.messages.hash : null,
        type: getTransactionType(
          transaction,
          address
        ),
        block: transaction.height,
        timestamp: transaction.timestamp,
        asset: getTransactionAsset(transaction),
        commision: transaction?.auth_info?.fee?.amount?.amount,
        gasLimit: transaction.gas_wanted,
        gasUsed: transaction.gas_used,
        nonce: transaction?.message?.data?.nonce,
      };
    });

    return [transactionData, data.page || 0, data.hasNext || false]
  }

  static async createInstance(signer, rpc) {
    CosmosService.instance = new CosmosService(signer);
    await CosmosService.instance.getTendermint34Client(rpc);
    return CosmosService.instance;
  }

  static getInstance() {
    if (!this.instance) throw new Error("Instance not created!");
    return this.instance;
  }

  static getInstanceSafely() {
    try {
      this.getInstance();
    } catch (e) {
      return null;
    }
  }
}
