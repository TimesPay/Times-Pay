import { prop, Typegoose } from "@typegoose/typegoose";

class Wallet extends Typegoose {
	@prop({ required: true })
	public address?: string;

	@prop({ required: true })
	public balance?: number;

	@prop({ required: true })
	public password?: string;

	@prop()
	public externalLink?: string;

	@prop({
		validate: (text) => {
			return /<(p|h1|h2|h3|h4|h5|h6|blockquote|ul|li|ol|img|!--).*?>|<([a-z]+).*?<\/\1>/i.test(
				text
			);
		},
	})
	public description?: string;

	@prop()
	public descriptionImage?: string;

	@prop()
	public finishedProject?: string;

	@prop()
	public expiredAt?: Date;
}
export interface WalletType {
	_id: string;
	address: string;
	balance: Number;
	password: string;
	description?: string;
	descriptionImage?: string;
	externalLink?: string;
	finishedProject?: string;
}

export default Wallet;
