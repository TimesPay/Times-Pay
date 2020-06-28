import { Request, Response } from "express";
import commonConfig from "../../../utils/commonConfig";
import allInOneMiddleware from "../../../utils/middleware/allInOneMiddleware";
import ProjectRepository from "../../../repository/projectRepository";

const handler = async (req: Request, res: Response) => {
	const { id } = req.query;
	if (id) {
		let projRepo = new ProjectRepository();
		try {
			const project = await projRepo.getProjectById(id);
			console.log("project", project[0]);
			if (project) {
				if (project[0]) {
					const updateProjRes = await projRepo.updateProjectProgress(
						project[0]
					);
					console.log("updateProjRes", updateProjRes);
					const projectData = JSON.parse(JSON.stringify(updateProjRes.value));
					if (projectData.receiverWallet.password) {
						delete projectData.receiverWallet.password;
					}
					if (projectData.receiverWallet._id) {
						delete projectData.receiverWallet._id;
					}
					res.status(200).json({
						content: [projectData],
						status: "success",
					});
				} else {
					res.status(200).json({
						content: project,
						status: "success",
					});
				}
			} else {
				res.status(200).json({
					content: project,
					status: "success",
				});
			}
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
