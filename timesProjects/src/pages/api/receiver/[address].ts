import { Request, Response } from "express";
import commonConfig from "../../../utils/commonConfig";
import allInOneMiddleware from "../../../utils/middleware/allInOneMiddleware";
import ReceiverRepository from "../../../repository/receiverRepository";

const handler = async (req: Request, res: Response) => {
	const { address } = req.query;
	if (address) {
		let receiverjRepo = new ReceiverRepository();
		try {
			const receiver = await receiverjRepo.getReceiverDetail({
				wallet: address,
			});
			console.log("receiver", receiver);
			const receiverObject = JSON.parse(JSON.stringify(receiver));
			for (let project in receiverObject) {
				if (receiverObject[project].receiverWallet.password) {
					delete receiverObject[project].receiverWallet.password;
				}
				if (receiverObject[project].receiverWallet._id) {
					delete receiverObject[project].receiverWallet._id;
				}
			}
			res.status(200).json({
				content: receiverObject,
				status: "success",
			});
		} catch (error) {
			res.status(502).json({
				content: [],
				status: "failed",
			});
		}
	} else {
		res.status(502).json({
			content: [],
			status: "failed",
		});
	}
};
export default allInOneMiddleware(handler);

export const config = {
	...commonConfig,
};
