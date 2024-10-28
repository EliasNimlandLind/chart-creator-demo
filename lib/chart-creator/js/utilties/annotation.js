export const createBand = (yMin = 200, yMax = 300, color) => {
	const band = {
		type: 'box',
		yMin: yMin,
		yMax: yMax,
		backgroundColor: color,
	};
	return band;
};
