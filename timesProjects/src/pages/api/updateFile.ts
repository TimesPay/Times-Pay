import { Request, Response } from 'express';
import fs from 'fs';
import { Base64 } from 'js-base64';
import moment from 'moment';

import commonConfig from '../../utils/commonConfig';
import allInOneMiddleware from '../../utils/middleware/allInOneMiddleware';
import ProjectRepository from '../../repository/projectRepository';

const handler = (req: Request, res: Response) => {
  if(req.method == "POST") {
    let fileToWrite = null;
    let result = {};
    let today = moment();
    let projRepo = new ProjectRepository();
    if(req.body["projectId"]){
      projRepo.getProjectById(req.body["projectId"]).then(record=>{
        if(record.length > 0) {
          console.log("req.body[‘projectWhitePaper’]");
          if (req.body["projectWhitePaper"]) {
            if (req.body["projectWhitePaper"].slice(0, "data:application/pdf;base64,".length) == "data:application/pdf;base64,") {
              fileToWrite = req.body["projectWhitePaper"].slice("data:application/pdf;base64,".length);
              let bin = Base64.atob(fileToWrite);
              // Your code to handle binary data
              fs.writeFile(`public/whitePaper${req.body["projectId"]}${today.format("YYYYMMDD_HHmmss")}.pdf`, bin, 'binary', error => {
                if (error) {
                  result["pdf"] = "pdf write failed";
                } else {
                  result["pdf"] = "success";
                }
              });
            }
          }
          if (req.body["projectImage"]) {
            console.log("req.body[projectImage]");
            let dataTypeLength = 0, dataType = "";
            if (
              req.body["projectImage"].slice(0, "data:image/jpg;base64,".length) == "data:image/jpg;base64,"
            ) {
              dataTypeLength = "data:image/jpg;base64,".length;
              dataType = "jpg";
            } else if (
              req.body["projectImage"].slice(0, "data:image/jpeg;base64,".length) == "data:image/jpeg;base64,"
            ) {
              dataTypeLength = "data:image/jpeg;base64,".length;
              dataType = "jpeg";
            } else if (
              req.body["projectImage"].slice(0, "data:image/png;base64,".length) == "data:image/png;base64,"
            ) {
              dataTypeLength = "data:image/png;base64,".length;
              dataType = "png";
            }
            if (dataTypeLength > 0) {
              fileToWrite = req.body["projectImage"].slice(dataTypeLength);
              let bin = Base64.atob(fileToWrite);
              // Your code to handle binary data
              fs.writeFile(`public/${req.body["projectId"]}${today.format("YYYYMMDD_HHmmss")}.${dataType}`, bin, 'binary', error => {
                if (error) {
                  result["projectImage"] = "Image write failed";
                } else {
                  result["projectImage"] = "success";
                }
              });
            }
          }
          let statusText = "";
          if (result["projectImage"] != result["pdf"]) {
            statusText = "partial success";
          } else if (result["projectImage"] == "success") {
            statusText = "success";
          } else {
            statusText = "failed";
          }
          res.status(200).json({
            content: result,
            status: statusText
          })
        }
      })
    } else {
      res.status(200).json({
        content: {
          whitePaper: req.body["whitePaper"] && "failed",
          projectImage: req.body["projectImage"] && "failed",
        },
        status: "failed",
        errCode: "updateFile.missingProjectId"
      })
    }
  }
}
export default allInOneMiddleware(handler);

export const config = {
  ...commonConfig
}
