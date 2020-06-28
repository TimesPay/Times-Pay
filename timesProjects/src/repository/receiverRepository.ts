import mongoose from "mongoose";
import { getModelForClass } from "@typegoose/typegoose";
import Project from "../models/project";
import config from "../utils/APIConfig";

class ReceiverRepository {
	public getReceiverDetail = (payload) => {
		return mongoose
			.connect(config.DBConnectionString, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				user: config.user,
				pass: config.password,
			})
			.then(() => {
				let projectModel = getModelForClass(Project);
				return projectModel
					.find({
						"receiverWallet.address": payload.wallet,
					})
					.exec();
			});
	};

	public editReceiver = (payload) => {
		try {
			return mongoose
				.connect(config.DBConnectionString, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					user: config.user,
					pass: config.password,
				})
				.then(() => {
					let projectModel = getModelForClass(Project);
					console.log(
						"editReceiver",
						{
							...payload.data,
						},
						payload.wallet
					);
					return projectModel
						.updateMany(
							{
								"receiverWallet.address": payload.wallet,
							},
							{
								...payload.data,
							},
							{
								omitUndefined: false,
								strict: true,
								rawResult: true,
								useFindAndModify: false,
								new: true,
							}
						)
						.exec();
				});
		} catch (e) {
			console.log(e);
		}
	};

	public getReceiverList = (payload) => {
		try {
			return mongoose
				.connect(config.DBConnectionString, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					user: config.user,
					pass: config.password,
				})
				.then(() => {
					let projectModel = getModelForClass(Project);
					console.log(
						"editReceiver",
						{
							...payload.data,
						},
						payload.wallet
					);
					const sortOn = this.sorterMapper(payload.sortOn);
					return projectModel
						.find()
						.select("receiverWallet")
						.sort(
							sortOn
								? {
										...sortOn,
								  }
								: {
										_id: -1,
								  }
						)
						.skip(payload["start"])
						.limit(payload["limit"])
						.exec();
				});
		} catch (e) {
			console.log(e);
		}
	};
	private sorterMapper = (param: any) => {
		let sorter = {};
		if (param) {
			let paramKeys = Object.keys(param);
			for (let key in paramKeys) {
				console.log("sorterMapper", paramKeys[key]);
				switch (paramKeys[key]) {
					case "id":
						sorter["receiverWallet._id"] = param[paramKeys[key]];
						break;
					case "finishedProject":
						sorter["receiverWallet.finishedProject"] = param[paramKeys[key]];
				}
			}
		}
		return sorter;
	};
}
export default ReceiverRepository;
