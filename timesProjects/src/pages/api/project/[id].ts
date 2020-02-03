import { Request, Response } from 'express';
import commonConfig from '../../../utils/commonConfig';
import allInOneMiddleware from '../../../utils/middleware/allInOneMiddleware';
import ProjectRepository from '../../../repository/projectRepository';

const handler = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (id) {
    let projRepo = new ProjectRepository();
    try{
      const project = await projRepo.getProjectById(id);
      console.log("project", project);
      res.status(200).json({
        content: project,
        status: "success"
      });
    } catch (error) {
      res.status(502).json({
        content:[],
        status: "failed"
      });
    }
  } else {
    res.status(502).json({
      content:[],
      status: "failed"
    });
  }
}
export default allInOneMiddleware(handler);

export const config = {
  ...commonConfig
}
