const randomColorValue = (min = 120, max = 210) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomColors = (numberOfColors, alpha = 1) => {
	let colors = [];
	for (let colorIndex = 0; colorIndex < numberOfColors; colorIndex++) {
		const randomColor = `rgba(${randomColorValue()}, ${randomColorValue()}, ${randomColorValue()}, ${alpha})`;
		colors.push(randomColor);
	}
	return colors;
};
