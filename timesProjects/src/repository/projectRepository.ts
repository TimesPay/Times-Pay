import mongoose from "mongoose";
import { getModelForClass } from "@typegoose/typegoose";
import Project, { ProjectType } from "../models/project";
import config from "../utils/APIConfig";
import moment from "moment";
import { ethers } from "ethers";
import bcrypt from "bcrypt";
import { abi, contractAddr } from "../utils/USDCAbi";

class ProjectRepository {
	public getProjects = (payload: any) => {
		return mongoose
			.connect(config.DBConnectionString, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				user: config.user,
				pass: config.password,
			})
			.then(() => {
				let projectModel = getModelForClass(Project);
				const sortOn = this.sorterMapper(payload.sortOn);
				return projectModel
					.find(this.filterMapper(payload["filters"]))
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
	};

	public updateProjectProgress = async (project: ProjectType) => {
		const { _id, receiverWallet, targetAmount } = project;
		console.log("updateProjectProgress", _id, receiverWallet, targetAmount);
		const { address } = receiverWallet;
		let defaultProvider = new ethers.providers.EtherscanProvider("homestead");
		let contract = new ethers.Contract(contractAddr, abi, defaultProvider);
		// let etherPrice = await defaultProvider.getEtherPrice();
		let newBalance = await contract.functions
			.balanceOf(address)
			.then((balance) => {
				// let etherString = ethers.utils.formatEther(balance);
				return parseFloat(balance) / 1000000;
			});
		console.log("newBalance", newBalance, (newBalance / targetAmount) * 100);
		return mongoose
			.connect(config.DBConnectionString, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				user: config.user,
				pass: config.password,
			})
			.then(() => {
				let projectModel = getModelForClass(Project);
				return projectModel.findOneAndUpdate(
					{
						_id: _id,
					},
					{
						raisedAmount: newBalance,
						progress: (newBalance / targetAmount) * 100,
					},
					{
						omitUndefined: false,
						strict: true,
						rawResult: true,
						useFindAndModify: false,
						new: true,
					}
				);
			});
	};

	public getProjectById = async (id: string) => {
		return mongoose
			.connect(config.DBConnectionString, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				user: config.user,
				pass: config.password,
			})
			.then(() => {
				let projectModel = getModelForClass(Project);
				return projectModel.find({ _id: id }).exec();
			});
	};

	public createProject = (payload: ProjectType) => {
		return mongoose
			.connect(config.DBConnectionString, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				user: config.user,
				pass: config.password,
			})
			.then(() => {
				console.log("create Project api", payload);
				let projectModel = getModelForClass(Project);
				const SALT_WORK_FACTOR = 10;
				const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
				payload.receiverWallet.password = bcrypt.hashSync(
					payload.receiverWallet.password,
					salt
				);
				return projectModel.create({
					...payload,
					createdAt: moment().toISOString(),
					expiredAt: "2200-12-31",
					progress: 0,
				} as ProjectType);
			});
	};
	public EditProject = (id: string, payload: any) => {
		return mongoose
			.connect(config.DBConnectionString, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				user: config.user,
				pass: config.password,
			})
			.then(() => {
				let projectModel = getModelForClass(Project);
				if (
					payload.hasOwnProperty("raisedAmount") &&
					payload.hasOwnProperty("targetAmount")
				) {
					if (!isNaN(payload.raisedAmount) && !isNaN(payload.targetAmount)) {
						payload.progress =
							(parseFloat(payload.raisedAmount) /
								parseFloat(payload.targetAmount)) *
							100;
					}
				} else if (payload.hasOwnProperty("raisedAmount")) {
					if (!isNaN(payload.raisedAmount)) {
						projectModel
							.find({ _id: id })
							.exec()
							.then((result) => {
								payload.progress =
									(parseFloat(payload.raisedAmount) / result[0].targetAmount) *
									100;
								return projectModel.findOneAndUpdate(
									{
										_id: id,
									},
									{
										...payload,
									},
									{
										omitUndefined: false,
										strict: true,
									}
								);
							});
					}
				} else if (payload.hasOwnProperty("targetAmount")) {
					if (!isNaN(payload.targetAmount)) {
						projectModel
							.find({ _id: id })
							.exec()
							.then((result) => {
								payload.progress =
									(result[0].raisedAmount / parseFloat(payload.targetAmount)) *
									100;
								return projectModel.findOneAndUpdate(
									{
										_id: id,
									},
									{
										...payload,
									},
									{
										omitUndefined: true,
										strict: true,
									}
								);
							});
					}
				}
				return projectModel.findOneAndUpdate(
					{
						_id: id,
					},
					{
						...payload,
					},
					{
						omitUndefined: true,
						strict: true,
					}
				);
			});
	};

	private sorterMapper = (param: any) => {
		let sorter = {};
		if (param) {
			let paramKeys = Object.keys(param);
			for (let key in paramKeys) {
				console.log("sorterMapper", paramKeys[key]);
				switch (paramKeys[key]) {
					case "id":
						sorter["_id"] = param[paramKeys[key]];
						break;
					case "projName":
						sorter["projectName"] = param[paramKeys[key]];
						break;
					case "receiver":
						sorter["receiverName"] = param[paramKeys[key]];
						break;
					case "raised":
						sorter["raisedAmount"] = param[paramKeys[key]];
						break;
					case "target":
						sorter["targetAmount"] = param[paramKeys[key]];
						break;
					case "progress":
						sorter["progress"] = param[paramKeys[key]];
						break;
					case "createdAt":
						sorter["createdAt"] = param[paramKeys[key]];
						break;
					case "expiredAt":
						sorter["expiredAt"] = param[paramKeys[key]];
						break;
				}
			}
		}
		return sorter;
	};

	private filterMapper = (param: any) => {
		let filter = {};
		if (param) {
			let paramKeys = Object.keys(param);
			for (let key in paramKeys) {
				console.log("filterMapper", paramKeys[key]);
				switch (paramKeys[key]) {
					case "id":
						filter["_id"] = param[paramKeys[key]];
						break;
					case "projName":
						if (param[paramKeys[key]]) {
							let regex = new RegExp(param[paramKeys[key]]);
							filter["projectName"] = { $regex: regex };
						}
						break;
					case "receiver":
						if (param[paramKeys[key]]) {
							let regex = new RegExp(param[paramKeys[key]]);
							filter["receiverName"] = { $regex: regex };
						}
						// filter["receiverName"] = param[paramKeys[key]];
						break;
					case "raised":
						filter["raisedAmount"] = param[paramKeys[key]];
						break;
					case "raisedFrom":
						if (!isNaN(param[paramKeys[key]])) {
							if (filter["raisedAmount"]) {
								filter["raisedAmount"] = {
									...filter["raisedAmount"],
									$gte: parseFloat(param[paramKeys[key]]),
								};
							} else {
								filter["raisedAmount"] = {
									$gte: parseFloat(param[paramKeys[key]]),
								};
							}
						}
						break;
					case "raisedTo":
						if (!isNaN(param[paramKeys[key]])) {
							if (filter["raisedAmount"]) {
								filter["raisedAmount"] = {
									...filter["raisedAmount"],
									$lte: parseFloat(param[paramKeys[key]]),
								};
							} else {
								filter["raisedAmount"] = {
									$lte: parseFloat(param[paramKeys[key]]),
								};
							}
						}
						break;
					case "target":
						filter["targetAmount"] = param[paramKeys[key]];
						break;
					case "targetFrom":
						if (!isNaN(param[paramKeys[key]])) {
							if (filter["targetAmount"]) {
								filter["targetAmount"] = {
									...filter["targetAmount"],
									$gte: parseFloat(param[paramKeys[key]]),
								};
							} else {
								filter["targetAmount"] = {
									$gte: parseFloat(param[paramKeys[key]]),
								};
							}
						}
						// filter["targetAmount"] = param[paramKeys[key]];
						break;
					case "targetTo":
						if (!isNaN(param[paramKeys[key]])) {
							if (filter["targetAmount"]) {
								filter["targetAmount"] = {
									...filter["targetAmount"],
									$lte: parseFloat(param[paramKeys[key]]),
								};
							} else {
								filter["targetAmount"] = {
									$lte: parseFloat(param[paramKeys[key]]),
								};
							}
						}
						// filter["targetAmount"] = param[paramKeys[key]];
						break;
					case "progress":
						filter["progress"] = param[paramKeys[key]];
						break;
					case "progressFrom":
						if (!isNaN(param[paramKeys[key]])) {
							if (filter["progress"]) {
								filter["progress"] = {
									...filter["progress"],
									$gte: parseFloat(param[paramKeys[key]]),
								};
							} else {
								filter["progress"] = {
									$gte: parseFloat(param[paramKeys[key]]),
								};
							}
						}
						// filter["progress"] = param[paramKeys[key]];
						break;
					case "progressTo":
						if (!isNaN(param[paramKeys[key]])) {
							if (filter["progress"]) {
								filter["progress"] = {
									...filter["progress"],
									$lte: parseFloat(param[paramKeys[key]]),
								};
							} else {
								filter["progress"] = {
									$lte: parseFloat(param[paramKeys[key]]),
								};
							}
						}
						// filter["targetAmount"] = param[paramKeys[key]];
						break;
					case "createdAt":
						filter["createdAt"] = param[paramKeys[key]];
						break;
					case "createdAtFrom":
						var date = moment(param[paramKeys[key]], "YYYY-MM-DD");
						if (date.isValid()) {
							if (filter["createdAt"]) {
								filter["createdAt"] = {
									...filter["createdAt"],
									$gte: date.toISOString(),
								};
							} else {
								filter["createdAt"] = {
									$gte: date.toISOString(),
								};
							}
						}
						// filter["createdAt"] = param[paramKeys[key]];
						break;
					case "createdAtTo":
						var date = moment(param[paramKeys[key]], "YYYY-MM-DD");
						if (date.isValid()) {
							if (filter["createdAt"]) {
								filter["createdAt"] = {
									...filter["createdAt"],
									$lte: date.toISOString(),
								};
							} else {
								filter["createdAt"] = {
									$lte: date.toISOString(),
								};
							}
						}
						// filter["createdAt"] = param[paramKeys[key]];
						break;
					case "expiredAt":
						filter["expiredAt"] = param[paramKeys[key]];
						break;
					case "expiredAtFrom":
						var date = moment(param[paramKeys[key]], "YYYY-MM-DD");
						if (date.isValid()) {
							if (filter["createdAt"]) {
								filter["createdAt"] = {
									...filter["createdAt"],
									$gte: date.toISOString(),
								};
							} else {
								filter["createdAt"] = {
									$gte: date.toISOString(),
								};
							}
						}
						// filter["expiredAt"] = param[paramKeys[key]];
						break;
					case "expiredAtTo":
						var date = moment(param[paramKeys[key]], "YYYY-MM-DD");
						if (date.isValid()) {
							if (filter["expiredAt"]) {
								filter["expiredAt"] = {
									...filter["expiredAt"],
									$lte: date.toISOString(),
								};
							} else {
								filter["expiredAt"] = {
									$lte: date.toISOString(),
								};
							}
						}
						// filter["expiredAt"] = param[paramKeys[key]];
						break;
				}
			}
		}
		return filter;
	};
}

export default ProjectRepository;
