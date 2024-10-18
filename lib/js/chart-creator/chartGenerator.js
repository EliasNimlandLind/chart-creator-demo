import { Chart } from 'chart.js/auto';
import zoomPlugin, { zoom } from 'chartjs-plugin-zoom';
import { getDataFromDatasetByIndex } from './utilties/datasetUtilties';
Chart.register(zoomPlugin);

export class ChartGenerator {
	constructor(
		context,
		mainChartType,
		zoomChartType,
		datasets,
		dataUnit,
		xAxisUnit,
		xAxisType = 'linear',
		yAxisType = 'linear',
		stepSize = 20
	) {
		this.canvas = context;
		this.mainChartType = mainChartType;
		this.zoomChartType = zoomChartType;
		this.datasets = datasets;
		this.dataUnit = dataUnit;
		this.xAxisUnit = xAxisUnit;
		this.randomColors = this.#getRandomColors(
			getDataFromDatasetByIndex(0, this.datasets).length
		);
		this.xAxisType = xAxisType;
		this.yAxisType = yAxisType;
		this.stepSize = stepSize;
	}

	generateChart() {
		const chartData = {
			labels: getDataFromDatasetByIndex(0, this.datasets).map(
				(_, index) => index + 1
			),
			datasets: this.datasets.map((dataset, index) => ({
				label: dataset.label,
				data: dataset.data,
				borderColor: this.randomColors[index],
				borderWidth: 0.5,
				pointRadius: 2,
				pointHoverRadius: 3,
				backgroundColor: this.randomColors[index],
				fill: false,
			})),
		};

		this.chartInstance = new Chart(this.canvas.getContext('2d'), {
			type: this.mainChartType,
			data: chartData,
			options: {
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
			},
		});

		const zoomChartMainContainer = document.createElement('div');
		zoomChartMainContainer.id = 'zoom-chart-main-container';
		document.body.appendChild(zoomChartMainContainer);

		this.#addChartClickListener(zoomChartMainContainer);
		window.addEventListener('beforeprint', () => {
			this.chartInstance.resize();
		});
		window.addEventListener('afterprint', () => {
			this.chartInstance.resize();
		});
	}

	#addChartClickListener(zoomChartMainContainer) {
		if (this.canvas) {
			this.canvas.addEventListener('click', (event) => {
				const activePoints = this.chartInstance.getElementsAtEventForMode(
					event,
					'nearest',
					{ intersect: true },
					false
				);

				if (activePoints.length) {
					const zoomChartId = `zoom-chart-${activePoints[0].index}`;
					const existingCanvas = document.getElementById(zoomChartId);
					if (existingCanvas) {
						return;
					}

					const zoomChartCanvas = document.createElement('canvas');
					zoomChartCanvas.id = zoomChartId;
					zoomChartCanvas.className = 'zoom-chart';

					const closeButton = document.createElement('button');
					closeButton.innerText = 'Close zoom chart';

					const individualZoomChartContainer = document.createElement('div');
					individualZoomChartContainer.id = zoomChartId + '-div';
					individualZoomChartContainer.appendChild(zoomChartCanvas);
					individualZoomChartContainer.appendChild(closeButton);
					zoomChartMainContainer.appendChild(individualZoomChartContainer);

					const clickedIndex = activePoints[0].index;
					this.#updateZoomChart(clickedIndex, zoomChartCanvas);

					closeButton.addEventListener('click', () => {
						individualZoomChartContainer.parentNode.removeChild(
							individualZoomChartContainer
						);
					});
				}
			});
		} else {
			console.error('Canvas element is not available.');
		}
	}

	#updateZoomChart(clickedDataPointIndex, zoomChartCanvas) {
		const color = this.randomColors;
		const data = this.datasets.map(
			(dataset) => dataset.data[clickedDataPointIndex]
		);

		const zoomChartData = {
			labels: this.datasets.map((dataset) => dataset.label),
			datasets: [
				{
					data: data,
					backgroundColor: color,
					borderWidth: 0,
				},
			],
		};

		const zoomChartContext = zoomChartCanvas.getContext('2d');
		this.zoomChartInstance = new Chart(zoomChartContext, {
			type: this.zoomChartType,
			data: zoomChartData,
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: `${this.dataUnit} för ${this.xAxisUnit} ${
							clickedDataPointIndex + 1
						}`,
					},
					tooltip: {
						callbacks: {
							label: (tooltipItem) => {
								const datasetLabel = tooltipItem.label;
								const price = tooltipItem.raw;
								return `${datasetLabel}: ${price} ${this.dataUnit}`;
							},
						},
					},
				},
			},
		});
	}

	#randomColorValue = (min = 120, max = 210) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	#getRandomColors(numberOfColors, alpha = 1) {
		let colors = [];
		for (let colorIndex = 0; colorIndex < numberOfColors; colorIndex++) {
			const randomColor = `rgba(${this.#randomColorValue()}, ${this.#randomColorValue()}, ${this.#randomColorValue()}, ${alpha})`;
			colors.push(randomColor);
		}
		return colors;
	}
}

export default ChartGenerator;
