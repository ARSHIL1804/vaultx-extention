import { API_CONSTANTS, APP_CONTANTS } from "@/lib/constants";
import { NATIVE_TOKEN } from "@/lib/enums";
import { TransactionPayload } from "@/lib/types";
import {
  NumberFormatter,
  getTransactionAsset,
  getTransactionType,
} from "@/lib/utils";
import { CoinBalance } from "@/providers/AccountProvider";
import { Coin, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  GasPrice,
  SigningStargateClient,
  calculateFee,
  defaultRegistryTypes,
} from "@cosmjs/stargate";
import {
  HttpBatchClient,
  Tendermint34Client,
  TendermintClient,
} from "@cosmjs/tendermint-rpc";
import { ethers } from "ethers";
import { useCallback } from "react";
import { CosmosService } from "./CosmosService";

export class EVMService {
  static instance = null;
  private readonly _signer;
  private readonly _provider;

  constructor(signer, provider) {
    this._provider = provider;
    this._signer = signer.connect(this._provider);
  }

  get signer() {
    return this._signer;
  }

  get provider() {
    return this._provider;
  }

  public async sendCoin(transferAmount: string, recipientAddress: string) {
    const { maxFeePerGas, maxPriorityFeePerGas } = await this.getSendCoinFee(
      transferAmount,
      recipientAddress
    );

    const senderAddress = await this.signer.getAddress();

    return await this.signer.sendTransaction({
      to: recipientAddress,
      from: senderAddress,
      value: transferAmount,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
  }

  public async getSendCoinFee(
    transferAmount: string,
    recipientAddress: string
  ) {
    const senderAddress = await this.signer.getAddress();
    const balance = await this.provider.getBalance(senderAddress);
    const { maxFeePerGas, maxPriorityFeePerGas } =
      await this.provider.getFeeData();
    if (!maxFeePerGas || !maxPriorityFeePerGas) {
      throw new Error("Provider is connected to the legacy network");
    }

    const estimatedGas = await this.signer.estimateGas({
      to: recipientAddress,
      from: senderAddress,
      value: transferAmount,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });

    const totalFee = NumberFormatter.toBigInt(estimatedGas * maxFeePerGas);

    if (balance < NumberFormatter.toBigInt(transferAmount) + totalFee) {
      throw new Error("Not Enough Balance");
    }

    return {
      amount: totalFee,
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  }

  public async getCallContactFee(
    payload: TransactionPayload,
    isEstimate = false
  ) {
    const contract = new ethers.Contract(
      payload.contractAddress,
      payload.contractABI,
      EVMService.getInstance().signer
    );

    const overrides = payload.transferAmount
      ? { value: NumberFormatter.parseUnits(payload.transferAmount).toString() }
      : undefined;

    const gasEstimate = overrides
      ? await contract[payload.functionName].estimateGas(
          ...payload.functionParams,
          overrides
        )
      : await contract[payload.functionName].estimateGas(
          ...payload.functionParams
        );

    if (isEstimate) {
      return gasEstimate;
    }
    const gasPrice = (await this.provider.getFeeData()).gasPrice

    return gasEstimate * gasPrice;
  }

  public async callContract(payload: TransactionPayload) {
    const contract = new ethers.Contract(
      payload.contractAddress,
      payload.contractABI,
      EVMService.getInstance().signer
    );

    const overrides = payload.transferAmount
      ? { value: NumberFormatter.parseUnits(payload.transferAmount).toString() }
      : undefined;

    const gasEstimate:any = await this.getCallContactFee(payload, true);


    const { maxFeePerGas, maxPriorityFeePerGas } =
    await this.provider.getFeeData();
    if (!maxFeePerGas || !maxPriorityFeePerGas) {
      throw new Error("Provider is connected to the legacy network");
    }

    const senderAddress = await this.signer.getAddress();
    const totalFee = NumberFormatter.toBigInt(gasEstimate * maxPriorityFeePerGas);
    const balance = await this.provider.getBalance(senderAddress);

    if (balance < NumberFormatter.toBigInt(payload.transferAmount) + totalFee) {
      throw new Error("Not Enough Balance");
    }

    console.log("HERE: " ,gasEstimate, maxFeePerGas, maxPriorityFeePerGas, NumberFormatter.formatUnits(totalFee));
    const tx = overrides
      ? await contract[payload.functionName](...payload.functionParams, {
          gasLimit: gasEstimate,
          ...overrides,
        })
      : await contract[payload.functionName](...payload.functionParams, {
          gasLimit: gasEstimate,
        });
    const receipt = await tx.wait();
    console.log(receipt, receipt.gasUsed);
    return receipt;
  }

  public async signMessage(message) {
    const signedMessage = await this.signer.signMessage(message);
    return signedMessage;
  }

  static createInstance(signer, provider) {
    if (!this.instance) {
      EVMService.instance = new EVMService(signer, provider);
    }
    return EVMService.instance;
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
