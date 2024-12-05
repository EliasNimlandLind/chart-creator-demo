const generateRandomColorValue = (min = 120, max = 210) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRandomColor = (alpha) => {
	const randomColor = `rgba(${generateRandomColorValue()}, ${generateRandomColorValue()}, ${generateRandomColorValue()}, ${alpha})`;
	return randomColor;
};

export const generateRandomColors = (numberOfColors, alpha = 1) => {
	let colors = [];
	for (let colorIndex = 0; colorIndex < numberOfColors; colorIndex++) {
		const randomColor = generateRandomColor(alpha);
		colors.push(randomColor);
	}
	return colors;
};
