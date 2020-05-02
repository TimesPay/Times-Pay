import { NextApiRequest, NextApiResponse } from 'next';
import commonConfig from '../../utils/commonConfig';
import allInOneMiddleware from '../../utils/middleware/allInOneMiddleware';
import ProjectRepository from '../../repository/projectRepository';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve)=>{
    let projRepo = new ProjectRepository();
    if(req.method == "PUT") {
      projRepo.createProject({
        ...req.body
      }).then(result=>{
        res.status(200).json({
          content: result,
          status: "success"
        });
        res.end();
        return resolve();
      })
    } else if (req.method == "GET") {
      let query = {};
      if(req.query) {
        console.log("getProjects req", req.query.sortOn);
        query['sortOn'] = JSON.parse(req.query.sortOn || "{}");
        if(!Array.isArray(req.query.pageSize) && !Array.isArray(req.query.page)) {
          if(!isNaN(req.query.pageSize) && !isNaN(req.query.page)) {
            query['limit'] = parseInt(req.query.pageSize) * (parseInt(req.query.page) + 1);
            query['start'] = parseInt(req.query.page) * parseInt(req.query.pageSize);
          }
        } else {
          query['limit'] = 4;
          query['start'] = 0;
        }
        query['filters'] = JSON.parse(req.query.filterOn || "{}");
        console.log("filters", query['filters']);
      }
      projRepo.getProjects(query).then(project=>{
        if(project){
          console.log("filters", query['filters']);
          // let progressFrom = isNaN(query['filters']['progressFrom'])
          // ? 0
          // : parseFloat(query['filters']['progressFrom']);
          // let progressTo = isNaN(query['filters']['progressTo'])
          // ? 0
          // : parseFloat(query['filters']['progressTo']);
          // let filteredProj = project.filter(value=>{
          //   let progress = value.raisedAmount / value.targetAmount * 100;
          //   console.log("progress", progress);
          //   if(
          //     query['filters'].hasOwnProperty("progressFrom") &&
          //     query['filters'].hasOwnProperty("progressTo")
          //   ) {
          //     return (
          //       progress >= progressFrom &&
          //       progress <= progressTo
          //     )
          //   }  else if (query['filters'].hasOwnProperty("progressFrom")) {
          //     return progress >= progressFrom
          //   } else if (query['filters'].hasOwnProperty("progressTo")) {
          //     return progress <= progressTo
          //   } else {
          //     return true;
          //   }
          // }).map(value=>{
          //   let raisedAmount = new Number(value.raisedAmount);
          //   value.raisedAmount = parseFloat(raisedAmount.toFixed(2));
          //   let targetAmount = new Number(value.targetAmount);
          //   value.targetAmount = parseFloat(targetAmount.toFixed(2));
          //   return value;
          // })
          res.status(200).json({
            content: project,
            status: "success"
          });
        } else {
          res.status(502);
        }
        res.end();
        return resolve();
      });
    }
    return resolve();
  });
}
export default allInOneMiddleware(handler);

export const config = {
  ...commonConfig
}
