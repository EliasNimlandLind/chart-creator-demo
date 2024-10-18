import { Chart } from 'chart.js/auto';

export class PieChart {
	constructor(colors, titleText, chartCanvas, dataset, dataUnit, xAxisUnit) {
		this.colors = colors;
		this.titleText = titleText;
		this.chartCanvas = chartCanvas;
		this.dataset = dataset;
		this.dataUnit = dataUnit;
		this.xAxisUnit = xAxisUnit;
	}

	getOptions = () => {
		const pieChartOptions = {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: this.titleText,
				},
				tooltip: {
					callbacks: {
						label: (tooltipItem) => {
							const datasetLabel = tooltipItem.label;
							const datasetPointData = tooltipItem.raw;
							return `${datasetLabel}: ${datasetPointData} ${this.dataUnit}`;
						},
					},
				},
			},
		};
		return pieChartOptions;
	};

	generate = () => {
		const chartContext = this.chartCanvas.getContext('2d');
		this.chart = new Chart(chartContext, {
			type: 'pie',
			data: this.dataset,
			options: this.getOptions(),
		});
	};
}
