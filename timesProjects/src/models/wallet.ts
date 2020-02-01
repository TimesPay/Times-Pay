import { prop, Typegoose } from '@typegoose/typegoose';

class Wallet extends Typegoose {
  @prop({required: true, unique: true})
  public address?: string;

  @prop({required: true})
  public balance?: number;

  @prop()
  public expiredAt?: Date;
}
export interface WalletType {
  address: string,
  balance: Number,
}

export default Wallet;
