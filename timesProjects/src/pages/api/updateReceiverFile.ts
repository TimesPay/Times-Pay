import { Request, Response } from "express";

import commonConfig from "../../utils/commonConfig";
import allInOneMiddleware from "../../utils/middleware/allInOneMiddleware";
import ReceiverRepository from "../../repository/receiverRepository";
import { imageHandler } from "../../utils/imageHandler";
const handler = async (req: Request, res: Response) => {
	if (req.method == "POST") {
		try {
			let statusList = [];
			// console.log(req.body.files);
			for (let image in req.body.files) {
				let status = await imageHandler(
					req.body.files[image].data,
					`receiver/${req.body.files[image].name}`,
					"icon"
				);
				statusList.push(status);
			}
			console.log("statusList", statusList);
			let fileListString = statusList.join();
			let receiverRepo = new ReceiverRepository();
			console.log("statusList", req.body.receiverWalletObj);
			const receiverProfile = await receiverRepo.editReceiver({
				data: {
					receiverWallet: {
						...req.body.receiverWalletObj,
						descriptionImage: fileListString,
					},
				},
				wallet: req.body.receiverWalletObj.address,
			});
			res.status(200).json({
				content: receiverProfile,
				status: "success",
			});
		} catch (e) {
			res.status(500).json({
				status: "failed",
				errCode: "updateFile.IO",
			});
		}
	}
};

export default allInOneMiddleware(handler);

export const config = {
	...commonConfig,
};
