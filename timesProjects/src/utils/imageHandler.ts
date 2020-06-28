import { Base64 } from "js-base64";
import { writeFile } from "./fileWriter";
export const imageHandler = async (
	data: any,
	folder: string,
	fileName: string
) => {
	let dataTypeLength = 0,
		dataType = "";
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
		console.log("binary data generated");
		// Your code to handle binary data
		try {
			let status = await writeFile(
				`public/${folder}/${fileName}.${dataType}`,
				bin,
				"binary"
			);
			console.log("status", status);
			return `/${folder}/${fileName}.${dataType}`;
		} catch (error) {
			console.log("error", error);
			return false;
		}
	}
};
