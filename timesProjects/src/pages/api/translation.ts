import { Request, Response } from "express";
import commonConfig from "../../utils/commonConfig";
import allInOneMiddleware from "../../utils/middleware/allInOneMiddleware";
import path from "path";
import fs from "fs";
import { readDir, readFile } from "../../utils/fileWriter";

const handler = (req: Request, res: Response) => {
  if (req.method == "GET") {
    if (req.query.locale) {
      readDir("public/static/locales/" + req.query.locale, {
        encoding: "utf-8"
      }).then(async (localeDir: fs.Dirent) => {
        try {
          let localeContent = {};
          for (let file in localeDir) {
            const localeFile = await readFile<string>(
              path.join(
                "public/static/locales/" + req.query.locale + "/",
                localeDir[file]
              ),
              "utf-8"
            );
            localeContent[
              `${localeDir[file].slice(0, localeDir[file].length - 5)}`
            ] = JSON.parse(localeFile);
          }
          const jsonBody = {
            content: {
              [req.query.locale]: localeContent
            },
            languages: [req.query.locale],
            status: "success",
            errCode: ""
          };
          res.status(200).json(jsonBody);
        } catch (e) {
          const jsonBody = {
            content: {},
            languages: [req.query.locale],
            status: "failed",
            errCode: "file read error"
          };
          res.status(200).json({ jsonBody });
        }
      });
    } else {
      try {
        let allLocaleDir = fs.readdirSync("public/static/locales/");
        let languages =[];
        const jsonBody = {
          content: {
          },
          status: "success",
          errCode: ""
        };
        for (let dir in allLocaleDir) {
          if (fs.statSync("public/static/locales/"+allLocaleDir[dir]).isDirectory()) {
            let localeDir = fs.readdirSync("public/static/locales/" + allLocaleDir[dir], {
              encoding: "utf-8"
            });
            for (let file in localeDir) {
              if(languages.indexOf(allLocaleDir[dir]) == -1) {
                languages.push(allLocaleDir[dir]);
              }
              const localeFile = fs.readFileSync(
                path.join(
                  "public/static/locales/" + allLocaleDir[dir] + "/",
                  localeDir[file]
                ),
                "utf-8"
              );
              if(! jsonBody['content'][allLocaleDir[dir]]) {
                jsonBody['content'][allLocaleDir[dir]] = {};
              }
              jsonBody['content'][allLocaleDir[dir]][
                `${localeDir[file].slice(0, localeDir[file].length - 5)}`
              ] = JSON.parse(localeFile);
            }
          }
        }
        jsonBody["languages"] = languages;
        res.status(200).json(jsonBody);
      } catch (e) {
        console.log(e);
        const jsonBody = {
          content: {},
          languages: [],
          status: "failed",
          errCode: "file read error"
        };
        res.status(200).json({ jsonBody });
      }
    }
  }
};
export default allInOneMiddleware(handler);

export const config = {
  ...commonConfig
};
