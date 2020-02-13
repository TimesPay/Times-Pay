import { network, dexAddress } from '../config';
import { ethers } from 'ethers';
import { get } from './apiHelper';

export abstract class DEXType {
  protected wallet: ethers.Wallet | null = null;
  public address: string | null = null;
  protected contract: ethers.Contract | null = null;
}

export class DEX extends DEXType {
  constructor(wallet: ethers.Wallet) {
    super();
    let provider = ethers.getDefaultProvider(network);
    this.wallet = wallet;
    this.address = "";
    this.initializer();
  }
  private initializer = async () => {
    this.address = await this.wallet!.getAddress();
  }
  public async swap(amount:number) {
    const params = {
      fromTokenSymbol: "USDC",
      toTokenSymbol: "ETH",
      amount: amount,
      slippage: 5,
      disableEstimate: "false",
      fromAddress: this.address
    }
    const response = await get(params);
    const swapData: {
      to: string,
      value: string,
      data: string,
      from: string,
      gas: string,
      gasPrice: string
    } = await response.json()
    let tx = {
        to: dexAddress,
        value: ethers.utils.parseEther(amount.toString()),
        data: swapData.data,
        gasPrice: swapData.gasPrice
    };
    return this.wallet!.sendTransaction(tx);
    // return fetch()
  }
}
