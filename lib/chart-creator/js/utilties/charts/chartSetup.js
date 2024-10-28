export const setupChart = (chartInstance) => {
	window.addEventListener('beforeprint', () => {
		chartInstance.resize();
	});
	window.addEventListener('afterprint', () => {
		chartInstance.resize();
	});
};
