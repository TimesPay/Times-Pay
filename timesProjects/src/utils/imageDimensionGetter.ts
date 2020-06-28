export const imageDimensionGetter = (link) => {
	if (typeof Image != "undefined") {
		console.log("Image", link);
		let imageOne = new Image();
		imageOne.src = link;
		// Get accurate measurements from that.
		var imageWidth = imageOne.naturalWidth;
		var imageHeight = imageOne.naturalHeight;
		return {
			width: imageWidth,
			height: imageHeight,
		};
	} else {
		return {
			width: 0,
			height: 0,
		};
	}
};
