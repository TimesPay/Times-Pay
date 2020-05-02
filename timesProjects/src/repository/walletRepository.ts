import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import Wallet, { WalletType } from '../models/wallet';
import config from '../utils/APIConfig';

class WalletRepository {
  getWalletByAddress = async (address: string) => {
    return await mongoose.connect(config.DBConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: config.user,
      pass: config.password
    }).then(() => {
      let walletCol = getModelForClass(Wallet);
      let wallets = walletCol.find({
        address: address,
      }).exec();
      return wallets
    })
  }
  getAllWallets = () => {
    return mongoose.connect(config.DBConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: config.user,
      pass: config.password
    }).then(() => {
      let walletCol = getModelForClass(Wallet);
      return walletCol.find().exec();
    })
  }

  createWallet = (wallet: Wallet) => {
    const walletContent: Wallet = wallet;
    return mongoose.connect(config.DBConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: config.user,
      pass: config.password
    }).then(() => {
      let walletCol = getModelForClass(Wallet);
      let doc = walletCol.create({
        ...walletContent,
        expiredAt: new Date("31 Dec 2200")
      } as Wallet).then((res) => {
        return JSON.stringify(res);
      });
      return doc;
    })
  }

  updateWallet = (wallet: Wallet) => {
    const walletContent: Wallet = wallet;
    console.log("walletContent", { ...walletContent });
    mongoose.connect(config.DBConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: config.user,
      pass: config.password
    }).then(() => {
      let walletCol = getModelForClass(Wallet);
      let doc = walletCol.findOneAndUpdate(
        { address: walletContent.address },
        {
          ...walletContent,
          expiredAt: walletContent.expiredAt
        }).then(res => {
          return JSON.stringify(res)
        });
        return doc;
    })
  }
}

export default WalletRepository;
