import fs from 'fs';

export const readDir = (path:string, opts:any) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, opts, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
};

export function readFile<T>(path, opts = 'binary'):Promise<T> {
  return new Promise<T>((resolve, reject) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

export const writeFile = (path:string, data:any, opts:any = 'binary') => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, opts, (err) => {
      console.log("fs", err);
      if (err) {
        reject(err);
      } else {
        resolve("success");
      }
    })
  })
}
