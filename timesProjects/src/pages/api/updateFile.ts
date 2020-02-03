import { Request, Response } from 'express';
import { Base64 } from 'js-base64';
import moment from 'moment';

import commonConfig from '../../utils/commonConfig';
import allInOneMiddleware from '../../utils/middleware/allInOneMiddleware';
import ProjectRepository from '../../repository/projectRepository';
import { writeFile } from '../../utils/fileWriter';

const handler = (req: Request, res: Response) => {
  if(req.method == "POST") {
    let fileToWrite = null;
    let result = {};
    const imageHandler = async (data: any) => {
      let dataTypeLength = 0, dataType = "";
      if (
        data.slice(0, "data:image/jpg;base64,".length) == "data:image/jpg;base64,"
      ) {
        dataTypeLength = "data:image/jpg;base64,".length;
        dataType = "jpg";
      } else if (
        data.slice(0, "data:image/jpeg;base64,".length) == "data:image/jpeg;base64,"
      ) {
        dataTypeLength = "data:image/jpeg;base64,".length;
        dataType = "jpeg";
      } else if (
        data.slice(0, "data:image/png;base64,".length) == "data:image/png;base64,"
      ) {
        dataTypeLength = "data:image/png;base64,".length;
        dataType = "png";
      }
      if (dataTypeLength > 0) {
        let fileToWrite = data.slice(dataTypeLength);
        let bin = Base64.atob(fileToWrite);
        // Your code to handle binary data
        try {
          let status = await writeFile(`public/${req.body["projectId"]}${today.format("YYYYMMDD_HHmmss")}.${dataType}`, bin, 'binary');
          projRepo.EditProject(req.body["projectId"], {
            projectImageURL: `${req.body["projectId"]}${today.format("YYYYMMDD_HHmmss")}.${dataType}`
          })
          result["projectImage"] = "success";
          console.log("image success");
        } catch (error) {
          result["projectImage"] = "failed";
          console.log("image failed");
        }
      };
    }
    let today = moment();
    let projRepo = new ProjectRepository();
    if(req.body["projectId"]){
      projRepo.getProjectById(req.body["projectId"]).then(async record=>{
        if(record.length > 0) {
          console.log("req.body[‘projectWhitePaper’]");
          if (req.body["projectWhitePaper"]) {
            if (req.body["projectWhitePaper"].slice(0, "data:application/pdf;base64,".length) == "data:application/pdf;base64,") {
              fileToWrite = req.body["projectWhitePaper"].slice("data:application/pdf;base64,".length);
              let bin = Base64.atob(fileToWrite);
              // Your code to handle binary data
              try{
                let status = await writeFile(`public/whitePaper${req.body["projectId"]}${today.format("YYYYMMDD_HHmmss")}.pdf`, bin, 'binary');
                projRepo.EditProject(req.body["projectId"], {
                  projectWhitePaperURL: `whitePaper${req.body["projectId"]}${today.format("YYYYMMDD_HHmmss")}.pdf`
                })
                console.log("status", status);
                result["pdf"] = status;
                if(req.body["projectImage"]) {
                  await imageHandler(req.body["projectImage"]);
                  let statusText = "";
                  console.log("white finish", result);
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
              } catch (error) {
                console.log("error");
                result["pdf"] = "failed";
                if(req.body["projectImage"]) {
                  await imageHandler(req.body["projectImage"]);
                  let statusText = "";
                  console.log("white finish", result);
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
              };
            }
          } else { //without whitePaper
            if(req.body["projectImage"]) {
              await imageHandler(req.body["projectImage"]);
              let statusText = "";
              console.log("white finish", result);
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
          }
        } else {
          res.status(200).json({
            content: result,
            status: "failed",
            errCode: "updateFile.IdNotExist"
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
