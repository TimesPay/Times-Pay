import { Request, Response } from "express";
import commonConfig from "../../utils/commonConfig";
import allInOneMiddleware from "../../utils/middleware/allInOneMiddleware";
import path from "path";
import fs from "fs";
import { readDir, readFile } from "../../utils/fileWriter";

const handler = (req: Request, res: Response) => {
  if (req.method == "GET") {
    console.log("req", req.query);
    if (req.query.locale) {
      readDir("public/static/locales/" + req.query.locale, {
        encoding: "utf-8"
      }).then(async (localeDir: fs.Dirent) => {
        try {
          console.log("localeDir", localeDir);
          let localeContent = {};
          for (let file in localeDir) {
            // if(file.isDirectory()) {
            console.log("file", file);
            const localeFile = await readFile<string>(
              path.join(
                "public/static/locales/" + req.query.locale + "/",
                localeDir[file]
              ),
              "utf-8"
            );
            console.log(
              "localeFile",
              localeFile,
              localeDir[file].slice(0, localeDir[file].length - 5)
            );
            localeContent[
              `${localeDir[file].slice(0, localeDir[file].length - 5)}`
            ] = JSON.parse(localeFile);
          }
          const jsonBody = {
            content: {
              [req.query.locale]: localeContent
            },
            status: "success",
            errCode: ""
          };
          console.log("jsonBody", jsonBody);
          res.status(200).json(jsonBody);
        } catch (e) {
          const jsonBody = {
            content: {},
            status: "failed",
            errCode: "file read error"
          };
          console.log("jsonBody", jsonBody);
          res.status(200).json({ jsonBody });
        }
      });
    }
  }
};
export default allInOneMiddleware(handler);

export const config = {
  ...commonConfig
};
