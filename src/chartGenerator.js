import { Chart } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import './pieChart.css';
import './lineChart.css';

Chart.register(zoomPlugin);

export class ChartGenerator {
	constructor(context, chartType, datasets, dataUnit, xAxisUnit = 'dag') {
		this.canvas = context;
		this.chartType = chartType;
		this.datasets = datasets;
		this.chart = null;
		this.dataUnit = dataUnit;
		this.xAxisUnit = xAxisUnit;
		this.pieChartInstance = null;
		this.randomColors = this.getRandomColors(datasets[0].data.length);
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
			type: this.chartType,
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
							mode: 'y',
						},
						pan: {
							enabled: true,
							mode: 'x',
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
		this.addChartClickListener();
	}

	addChartClickListener() {
		if (this.canvas) {
			this.canvas.addEventListener('click', (event) => {
				const activePoints = this.chartInstance.getElementsAtEventForMode(
					event,
					'nearest',
					{ intersect: true },
					false
				);

				if (activePoints.length) {
					const pieChartId = 'pie-chart';
					const existingCanvas = document.getElementById(pieChartId);
					if (existingCanvas) {
						existingCanvas.parentNode.removeChild(existingCanvas);
					}

					const pieChartCanvas = document.createElement('canvas');
					pieChartCanvas.id = pieChartId;
					document.body.appendChild(pieChartCanvas);

					const clickedIndex = activePoints[0].index;
					this.updatePieChart(clickedIndex, pieChartCanvas);
				}
			});
		} else {
			console.error('Canvas element is not available.');
		}
	}

	updatePieChart(dayIndex, pieChartCanvas) {
		const color = this.randomColors;
		const data = this.datasets.map((dataset) => dataset.data[dayIndex]);

		const pieChartData = {
			labels: this.datasets.map((dataset) => dataset.label),
			datasets: [
				{
					data: data,
					backgroundColor: color,
					borderWidth: 0,
				},
			],
		};

		const pieChartContext = pieChartCanvas.getContext('2d');
		this.pieChartInstance = new Chart(pieChartContext, {
			type: 'pie',
			data: pieChartData,
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

		pieChartCanvas.addEventListener(
			'contextmenu',
			function (event) {
				event.preventDefault();
				pieChartCanvas.parentNode.removeChild(pieChartCanvas);
				this.pieChartInstance.destroy();
			}.bind(this)
		);
	}

	randomColorValue = (min = 120, max = 210) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	getRandomColors(numberOfColors, alpha = 1) {
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
