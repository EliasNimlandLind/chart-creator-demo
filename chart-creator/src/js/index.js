import { Chart } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

export class ChartGenerator {
	constructor(
		context,
		mainChartType,
		zoomInChartType,
		datasets,
		dataUnit,
		xAxisUnit = 'dag'
	) {
		this.canvas = context;
		this.mainChartType = mainChartType;
		this.zoomInChartType = zoomInChartType;
		this.datasets = datasets;
		this.dataUnit = dataUnit;
		this.xAxisUnit = xAxisUnit;
		this.zoomChartInstance = null;
		this.randomColors = this.#getRandomColors(datasets[0].data.length);
	}

	generateChart() {
		const chartData = {
			labels: this.datasets[0].data.map((_, index) => index + 1),
			datasets: this.datasets.map((dataset, index) => ({
				label: dataset.label,
				data: dataset.data,
				borderColor: this.randomColors[index],
				borderWidth: 0.5,
				pointRadius: 2,
				pointHoverRadius: 3,
				lineTension: 0.0001,
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
						zoom: {
							wheel: {
								enabled: true,
							},
							pinch: {
								enabled: true,
							},
							mode: 'xy',
						},
						pan: {
							enabled: true,
							mode: 'xy',
						},
					},
				},
				scales: {
					x: {
						beginAtZero: true,
						title: {
							display: true,
							text: this.xAxisUnit,
						},
						ticks: {
							autoSkip: true,
							minRotation: 25,
							maxRotation: 45,
							callback: function (index) {
								return this.getLabelForValue(index);
							},
						},
					},
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: this.dataUnit,
						},
					},
				},
			},
		});
		this.#addChartClickListener();
		this.addEventListener('beforeprint', () => {
			this.chartInstance.resize();
		});
		this.addEventListener('afterprint', () => {
			this.chartInstance.resize();
		});
	}

	#addChartClickListener() {
		if (this.canvas) {
			this.canvas.addEventListener('click', (event) => {
				const activePoints = this.chartInstance.getElementsAtEventForMode(
					event,
					'nearest',
					{ intersect: true },
					false
				);

				if (activePoints.length) {
					const zoomChartId = 'zoom-chart';
					const existingCanvas = document.getElementById(zoomChartId);
					if (existingCanvas) {
						existingCanvas.parentNode.removeChild(existingCanvas);
					}

					const zoomChartCanvas = document.createElement('canvas');
					zoomChartCanvas.id = zoomChartId;
					document.body.appendChild(zoomChartCanvas);

					const clickedIndex = activePoints[0].index;
					this.#updateZoomChart(clickedIndex, zoomChartCanvas);
				}
			});
		} else {
			console.error('Canvas element is not available.');
		}
	}

	#updateZoomChart(dayIndex, zoomChartCanvas) {
		const color = this.randomColors;
		const data = this.datasets.map((dataset) => dataset.data[dayIndex]);

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
			type: 'pie',
			data: zoomChartData,
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: `${this.dataUnit} för dag ${dayIndex + 1}`, // Set the title for new instance
					},
					tooltip: {
						callbacks: {
							label: (tooltipItem) => {
								const datasetLabel = tooltipItem.label;
								const price = tooltipItem.raw;
								return `${datasetLabel}: ${price} ${this.dataUnit}`; // Use the correct unit
							},
						},
					},
				},
			},
		});

		zoomChartCanvas.addEventListener(
			'contextmenu',
			function (event) {
				event.preventDefault();
				zoomChartCanvas.parentNode.removeChild(zoomChartCanvas);
				this.zoomChartInstance.destroy();
			}.bind(this)
		);
	}

	randomColorValue = (min = 120, max = 210) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	#getRandomColors(numberOfColors, alpha = 1) {
		let colors = [];
		for (let colorIndex = 0; colorIndex < numberOfColors; colorIndex++) {
			const randomColor = `rgba(${this.randomColorValue()}, 
    ${this.randomColorValue()}, 
    ${this.randomColorValue()},
    ${alpha})`;
			colors.push(randomColor);
		}
		return colors;
	}
}

export default ChartGenerator;
