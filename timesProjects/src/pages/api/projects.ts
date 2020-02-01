import { Request, Response } from 'express';
import commonConfig from '../../utils/commonConfig';
import allInOneMiddleware from '../../utils/middleware/allInOneMiddleware';
import ProjectRepository from '../../repository/projectRepository';

const handler = (req: Request, res: Response) => {
  let projRepo = new ProjectRepository();
  if(req.method == "POST") {
    projRepo.createProject({
      ...req.body
    }).then(result=>{
      res.status(200).json({
        content: result,
        status: "success"
      })
    })
  } else if (req.method == "GET") {
    let query;
    projRepo.getProjects(query).then(project=>{
      if(project){
        res.status(200).json({
          content: project,
          status: "success"
        });
      } else {
        res.status(502);
      }
    });
  }
}
export default allInOneMiddleware(handler);

export const config = {
  ...commonConfig
}
