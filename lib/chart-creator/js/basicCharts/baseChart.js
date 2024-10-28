import { Chart } from 'chart.js/auto';

export class BaseChart {
	constructor(colors, chartCanvas, dataUnit) {
		this.colors = colors;
		this.chartCanvas = chartCanvas;
		this.dataUnit = dataUnit;
		this.chartInstance = null;
	}

	getChartInstance() {
		return this.chartInstance;
	}

	generateBase(data, options, type) {
		const chartContext = this.chartCanvas.getContext('2d');
		this.chartInstance = new Chart(chartContext, {
			type: type,
			data: data,
			options: options,
		});
	}
}
export default BaseChart;
