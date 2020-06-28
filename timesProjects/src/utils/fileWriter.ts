import fs from "fs";

export const readDir = (path: string, opts: any) => {
	return new Promise((resolve, reject) => {
		fs.readdir(path, opts, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
};

export function readFile<T>(path, opts = "binary"): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		fs.readFile(path, opts, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}

export const writeFile = (path: string, data: any, opts: any = "binary") => {
	return new Promise((resolve, reject) => {
		const folderArray = path.split("/");
		console.log("folderArray", folderArray);
		fs.open(path, "wx", (err, fd) => {
			console.log("open", err);
			if (err) {
				if (err.code === "EEXIST") {
					console.error("myfile already exists");
					return;
				} else if (err.code === "ENOENT") {
					let folder = folderArray
						.filter((value) => !value.includes("."))
						.join("/");
					folder = folder + "/";
					console.log("folder", folder);
					fs.mkdirSync(folder, { recursive: true });
					fs.writeFile(path, data, opts, (err) => {
						console.log("fs", err);
						if (err) {
							reject(err);
						} else {
							resolve("success");
						}
					});
					return;
				}
				throw err;
			}

			fs.writeFile(path, data, opts, (err) => {
				console.log("fs", err);
				if (err) {
					reject(err);
				} else {
					resolve("success");
				}
			});
		});
	});
};
