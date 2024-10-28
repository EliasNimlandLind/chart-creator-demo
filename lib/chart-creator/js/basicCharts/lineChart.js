import { Chart } from 'chart.js/auto';

import { getLargestDataInDatasets } from '../utilties/datasetUtilties';
import { setupChart } from '../utilties/charts/chartSetup';

import { createBand } from '../utilties/annotation';
import { generateRandomColor } from '../utilties/colorGeneration';

export class LineChart {
	constructor(
		colors,
		chartCanvas,
		datasets,
		dataUnit,

		xAxisUnit,
		xAxisType,
		yAxisType,

		yMinBandRange,
		ymaxBandRange,
		annotationsConfiguration = {
			band: createBand(yMinBandRange, ymaxBandRange, generateRandomColor(0.2)),
		},

		spanGaps = true,
		enableAnimations = true,
		animationConfiguration = {
			duration: 100,
			easing: 'easeInQuad',
			loop: false,
		},
		stepSize = 10,
		xAxisBeginAtZero = false,
		yAxisBeginAtZero = false,
		automaticallySkipTicks = true,

		xAxisMaxZoom = getLargestDataInDatasets(datasets).length,
		yAxisMaxZoom = Math.max(getLargestDataInDatasets(datasets)),

		updatingChartResolution = 100
	) {
		this.colors = colors;
		this.chartCanvas = chartCanvas;
		this.datasets = datasets;
		this.dataUnit = dataUnit;

		this.xAxisUnit = xAxisUnit;
		this.xAxisType = xAxisType;
		this.yAxisType = yAxisType;

		this.annotationsConfiguration = annotationsConfiguration;

		this.spanGaps = spanGaps;
		this.enableAnimations = enableAnimations;
		this.animationConfiguration = animationConfiguration;

		this.stepSize = stepSize;
		this.xAxisBeginAtZero = xAxisBeginAtZero;
		this.yAxisBeginAtZero = yAxisBeginAtZero;
		this.automaticallySkipTicks = automaticallySkipTicks;
		this.chartInstance = null;

		this.xAxisMaxZoom = xAxisMaxZoom;
		this.yAxisMaxZoom = yAxisMaxZoom;

		this.highestLabelIndex = 0;
		this.updatingChartResolution = updatingChartResolution;

		this.isPaused = false;

		const pauseChartUpdatesButton = document.getElementById(
			'pause-chart-updates-button'
		);
		pauseChartUpdatesButton.addEventListener('click', () => {
			this.isPaused = !this.isPaused;
			pauseChartUpdatesButton.textContent = this.isPaused ? 'Resume' : 'Pause';
		});
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
							max: this.xAxisMaxZoom,
							minRange: 1,
						},
						y: {
							min: 0,
							max: this.yAxisMaxZoom,
							minRange: 1,
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
				annotation: {
					annotations: this.annotationsConfiguration,
				},
			},
			scales: {
				x: {
					type: this.xAxisType,
					beginAtZero: this.xAxisBeginAtZero,
					title: {
						display: true,
						text: this.xAxisUnit,
					},
					ticks: {
						autoSkip: this.automaticallySkipTicks,
						minRotation: 25,
						maxRotation: 45,
						stepSize: this.stepSize,
						callback: function (index) {
							return this.getLabelForValue(index);
						},
					},
				},
				y: {
					type: this.yAxisType,
					beginAtZero: this.yAxisBeginAtZero,

					title: {
						display: true,
						text: this.dataUnit,
					},
				},
			},
			spanGaps: this.spanGaps,
			animation: this.animationConfiguration,
			animations: this.enableAnimations,
		};

		return lineChartOptions;
	};

	generate = () => {
		const chartData = {
			labels: getLargestDataInDatasets(this.datasets).map(
				(_, index) => index + 1
			),
			datasets: this.datasets.map((dataset, index) => ({
				label: dataset.label,
				data: dataset.data,
				borderColor: this.colors[index],
				borderWidth: 1,
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

	update(data) {
		if (this.isPaused === false) {
			this.xAxisMaxZoom = getLargestDataInDatasets(this.datasets).length;
			this.yAxisMaxZoom = getLargestDataInDatasets(this.datasets);

			this.chartInstance.options = this.getOptions();

			this.chartInstance.data.labels.push(this.highestLabelIndex);

			let chartData = this.chartInstance.data.datasets[0].data;

			chartData.push(data);
			this.highestLabelIndex++;

			if (chartData.length > this.updatingChartResolution) {
				chartData.shift();
				this.chartInstance.data.labels.shift();
			}

			if (!this.isPaused) {
				this.chartInstance.update();
			}
		}
	}
}
