import { prop, Typegoose } from '@typegoose/typegoose';
import Wallet, { WalletType } from './wallet';

class Project extends Typegoose {
  @prop({required: true, index: true})
  public receiverWallet?: Wallet;

  @prop({required: true})
  public receiverName?: string;

  @prop({ required: true, maxlength: 255, unique: true})
  public projectName?: string;

  @prop({required: true, maxlength: 255, minlength: 10})
  public projectDescciption?: string;

  @prop()
  public projectImageURL?: string;

  @prop()
  public projectWhitePaperURL?: string;

  @prop({ required: true})
  public targetAmount?: number;

  @prop()
  public raisedAmount?: number;

  @prop()
  public progress?: number;

  @prop()
  public createdAt?: Date;

  @prop()
  public expiredAt?: Date;
}

export interface ProjectType {
  receiverWallet?: WalletType;
  receiverName?: string;
  projectName?: string;
  projectDescciption?: string;
  projectImageURL?: string;
  projectWhitePaperURL?: string;
  targetAmount?: number;
  raisedAmount?: number;
  createdAt?: Date,
  expiredAt?: Date
}

export default Project;
