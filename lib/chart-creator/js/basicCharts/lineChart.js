import { Chart } from 'chart.js/auto';

import { getDataFromDatasetByIndex } from '../utilties/datasetUtilties';
import { setupChart } from '../utilties/chartSetup';

export class LineChart {
	constructor(
		colors,
		chartCanvas,
		datasets,
		dataUnit,
		xAxisUnit,
		xAxisType,
		stepSize = 25
	) {
		this.colors = colors;
		this.chartCanvas = chartCanvas;
		this.datasets = datasets;
		this.dataUnit = dataUnit;
		this.xAxisUnit = xAxisUnit;
		this.xAxisType = xAxisType;
		this.stepSize = stepSize;

		this.chartInstance = null;
	}
	getChartInstance() {
		return this.chartInstance;
	}
	getOptions = () => {
		const lineChartOptions = {
			responsive: true,
			plugins: {
				tooltip: {
					callbacks: {
						title: () => '',
						label: (tooltipItem) => {
							const datasetLabel = tooltipItem.dataset.label || '';
							const dataInDataPoint = tooltipItem.raw;
							return `${datasetLabel}: ${dataInDataPoint} ${this.dataUnit}`;
						},
					},
				},
				zoom: {
					limits: {
						x: {
							min: 0,
							max: getDataFromDatasetByIndex(0, this.datasets).length,
							minRange: 50,
						},
						y: {
							min: 0,
							max: Math.max(getDataFromDatasetByIndex(0, this.datasets)),
							minRange: 50,
						},
					},
					pan: {
						enabled: true,
						mode: 'xy',
					},
					zoom: {
						wheel: {
							enabled: true,
						},
						pinch: {
							enabled: false,
						},
						mode: 'xy',
					},
				},
			},
			scales: {
				x: {
					type: this.xAxisType,
					beginAtZero: true,
					title: {
						display: true,
						text: this.xAxisUnit,
					},
					ticks: {
						autoSkip: true,
						minRotation: 25,
						maxRotation: 45,
						stepSize: this.stepSize,
						callback: function (index) {
							return this.getLabelForValue(index);
						},
					},
				},
				y: {
					type: this.xAxisType,
					beginAtZero: true,
					title: {
						display: true,
						text: this.dataUnit,
					},
				},
			},
		};

		return lineChartOptions;
	};

	generate = () => {
		const chartData = {
			labels: getDataFromDatasetByIndex(0, this.datasets).map(
				(_, index) => index + 1
			),
			datasets: this.datasets.map((dataset, index) => ({
				label: dataset.label,
				data: dataset.data,
				borderColor: this.colors[index],
				borderWidth: 0.5,
				pointRadius: 2,
				pointHoverRadius: 3,
				backgroundColor: this.colors[index],
				fill: false,
			})),
		};

		const chartContext = this.chartCanvas.getContext('2d');
		this.chartInstance = new Chart(chartContext, {
			type: 'line',
			data: chartData,
			options: this.getOptions(),
		});
		setupChart(this.chartInstance);
	};
}
