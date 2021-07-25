function resize(destinationWidth, destinationHeight, preview) {
	function resizer(currentImage) {
	  return new Promise((resolve, reject) => {
		// Resize image
		const image = new Image();
		const canvas = document.createElement("canvas");
		const tempContext = canvas.getContext("2d");
  
		const nextWidth = Math.max(destinationWidth, currentImage.width / 2);
		const nextHeight = Math.max(destinationHeight, currentImage.height / 2);
		// Set canvas to next image dimension
		canvas.width = nextWidth;
		canvas.height = nextHeight;
		// Draw it onto the context
		tempContext.drawImage(
		  currentImage,
		  0,
		  0,
		  currentImage.width,
		  currentImage.height,
		  0,
		  0,
		  nextWidth,
		  nextHeight
		);
		// set the url
		image.width = nextWidth;
		image.height = nextHeight;
		image.src = canvas.toDataURL();
		// on image load resolve
		image.onload = function () {
		  resolve(image);
		};
  
		image.onerror = function (e) {
		  reject(e);
		};
	  });
	}
  
	return new Promise(async (resolve, reject) => {
	  if (
		destinationWidth > preview.width ||
		destinationHeight > preview.height
	  ) {
		reject("Destination Width cannot be greater than actual canvas");
		return;
	  }
  
	  try {
		let nextImage = preview;
		do {
		  nextImage = await resizer(nextImage);
		} while (
		  nextImage.width > destinationWidth ||
		  nextImage.height > destinationHeight
		);
		console.log(
		  `Resized successfully to ${nextImage.width} x ${nextImage.height}`
		);
		resolve({
		  src: nextImage.src,
		  width: nextImage.width,
		  height: nextImage.height
		});
	  } catch (e) {
		reject(e);
	  }
	});
  }
  