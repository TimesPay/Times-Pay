import { network, dexAddress, contractAddr, dexProxyAddress } from '../config';
import { ethers, utils } from 'ethers';
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
    this.address = wallet.signingKey.address;
    this.initializer();
  }
  private initializer = async () => {
    this.address = await this.wallet!.getAddress();
  }
  public async swap(amount:number) {
    const { wallet } = this;
    const params = {
      fromTokenSymbol: "USDC",
      toTokenSymbol: "ETH",
      amount: amount,
      slippage: 1,
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
    } = await response.json();
    let tx = {
        to: dexProxyAddress,
        value: utils.parseEther(swapData.value),
        data: swapData.data,
    };
    console.log("tx", tx);
    return wallet!.sendTransaction(tx);
    // return fetch()
  }
}
