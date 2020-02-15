import { network, contractAddr, dexAddress } from '../config';
import { ethers } from 'ethers';
export abstract class TimesCoinType {
  protected wallet: ethers.Signer;
  public address: string;
  protected abi: any[];
  protected contract: ethers.Contract;
  abstract initialize(): void;
  abstract getBalance(): Promise<string>;
}
export class TimesCoin extends TimesCoinType {
  constructor(wallet:ethers.Wallet) {
    super();
    console.log("TimesCoin constructor", wallet)
    let provider = ethers.getDefaultProvider(network);
    this.wallet = new ethers.Wallet(wallet.signingKey.privateKey, provider);
    this.address = wallet.signingKey.address
    this.abi = [
      {
        constant: false,
        inputs: [
          {
            internalType: "contract IERC20",
            name: "token",
            type: "address"
          },
          {
            internalType: "address",
            name: "who",
            type: "address"
          },
          {
            internalType: "address",
            name: "dest",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "claimTokens",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "uint256",
            name: "gasSpent",
            type: "uint256"
          }
        ],
        name: "burnGasToken",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "gasToken",
        outputs: [{ internalType: "contract IGST2", name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "gasTokenOwner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          { internalType: "contract IGST2", name: "_gasToken", type: "address" },
          { internalType: "address", name: "_gasTokenOwner", type: "address" }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_addr",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "owner",
            "type": "address"
          },
          {
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_spender",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      { payable: false, stateMutability: "nonpayable", type: "fallback" },
    ];
    this.initialize();
  }

  private async initialize() {
    // let provider = ethers.getDefaultProvider(network);
    this.contract = new ethers.Contract(contractAddr, this.abi, this.wallet);
    console.log("initialize contract", this.contract, contractAddr, this.wallet);
  }

  public async getBalance() {
    return await this.contract.functions.balanceOf(this.address);
  }
  public async transfer(destAddress:string, amount:number) {
    // return await this.contract.functions.transfer(destAddress, amount);
    return await this.contract.functions.transfer(destAddress, amount);
  }
  public async payEstimate(destAddress:string, amount:number) {
    // return await this.contract.estimate.transfer(destAddress, amount);
    return await this.contract.estimate.transfer(destAddress, amount);
  }
  public async approve(amount:number | ethers.utils.BigNumber) {
    console.log("approve", this.address, ethers.utils.parseEther(amount.toString()));
    return await this.contract.functions.approve(dexAddress, ethers.utils.parseEther(amount.toString()));
  }
  public async allowance() {
    return await this.contract.functions.allowance(this.address, dexAddress);
  }
}
