export const createBand = (yMinimum = 200, yMaximum = 300, color) => {
	const band = {
		type: 'box',
		yMin: yMinimum,
		yMax: yMaximum,
		backgroundColor: color,
	};
	return band;
};

export const createLine = (
	yMinimum = 200,
	yMaximum = 300,
	color,
	borderWidth = 2
) => {
	const line = {
		type: 'line',
		yMin: yMinimum,
		yMax: yMaximum,
		borderColor: color,
		borderWidth: borderWidth,
	};
	return line;
};
