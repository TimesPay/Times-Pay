export const transformationPercentageCalculator = (
	dimensionTwo,
	targetDimension
) => {
	//dimensionOne is the dimension of the center image
	//dimensionTwo is the dimension of the target image
	let percentage = 0;
	if (targetDimension && dimensionTwo) {
		let targetHeight = targetDimension.height;
		let targetWidth = targetDimension.width;
		let heightRatio =
			dimensionTwo.height > 0 ? targetHeight / dimensionTwo.height : 1;
		let widthRatio =
			dimensionTwo.width > 0 ? targetWidth / dimensionTwo.width : 1;
		console.log(
			"mapped height",
			widthRatio * dimensionTwo.height,
			targetHeight,
			targetWidth
		);
		if (heightRatio > widthRatio) {
			//width dominate the strech
			percentage =
				(targetHeight - widthRatio * dimensionTwo.height) / 2 / targetHeight;
		} else {
			percentage =
				(targetHeight - heightRatio * dimensionTwo.height) / 2 / targetHeight;
		}
	}
	return percentage * 100;
};
