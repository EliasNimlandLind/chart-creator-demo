import { getLargestDataInDatasets } from '../utilties/datasetUtilties';
import { setupChart } from '../utilties/charts/chartSetup';
import { createBand, createLine } from '../utilties/charts/annotation';
import { generateRandomColor } from '../utilties/charts/colorGeneration';
import { BaseChart } from './baseChart';

export class LineChart extends BaseChart {
	constructor(
		colors,
		chartCanvas,
		datasets,
		dataUnit,
		xAxisUnit,
		xAxisType,
		yAxisType = 'logarithmic',
		yMinBandRange,
		ymaxBandRange,
		annotationsConfiguration = {
			band: createBand(yMinBandRange, ymaxBandRange, generateRandomColor(0.2)),
			line: createLine(
				yMinBandRange + 5,
				ymaxBandRange + 10,
				generateRandomColor(1)
			),
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
		updatingChartResolution = 500
	) {
		super(colors, chartCanvas, dataUnit);
		this.datasets = datasets;
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
		this.updatingChartResolution = updatingChartResolution;
		this.xAxisMaxZoom = getLargestDataInDatasets(datasets).length;
		this.yAxisMaxZoom = Math.max(getLargestDataInDatasets(datasets));
		this.highestLabelIndex = 0;
		this.isPaused = false;

		const pauseChartUpdatesButton = document.getElementById(
			'pause-chart-updates-button'
		);
		pauseChartUpdatesButton.addEventListener('click', () => {
			this.isPaused = !this.isPaused;
			pauseChartUpdatesButton.textContent = this.isPaused ? 'Resume' : 'Pause';
		});
	}

	getOptions = () => ({
		responsive: true,
		plugins: {
			tooltip: {
				callbacks: {
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
					stepSize: this.stepSize,
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
	});

	generate = () => {
		const chartData = {
			labels: getLargestDataInDatasets(this.datasets).map(
				(_, index) => index + 1
			),
			datasets: this.datasets.map((dataset, index) => ({
				label: dataset.label,
				data: dataset.data,
				borderColor: this.colors[index],
				backgroundColor: this.colors[index],
				fill: false,
			})),
		};
		this.generateBase(chartData, this.getOptions(), 'line');
		setupChart(this.chartInstance);
	};

	update(data) {
		if (!this.isPaused) {
			this.xAxisMaxZoom = getLargestDataInDatasets(this.datasets).length;
			this.yAxisMaxZoom = getLargestDataInDatasets(this.datasets);

			this.highestLabelIndex++;
			this.chartInstance.data.labels.push(this.highestLabelIndex);
			super.update([data]);
		}
	}

	update(data) {
		if (!this.isPaused) {
			this.xAxisMaxZoom = getLargestDataInDatasets(this.datasets).length;
			this.yAxisMaxZoom = getLargestDataInDatasets(this.datasets);

			this.chartInstance.options = this.getOptions();
			this.chartInstance.data.labels.push(this.highestLabelIndex);
			this.chartInstance.data.datasets[0].data.push(data);
			this.highestLabelIndex++;

			if (
				this.chartInstance.data.datasets[0].data.length >
				this.updatingChartResolution
			) {
				this.chartInstance.data.datasets[0].data.shift();
				this.chartInstance.data.labels.shift();
			}

			this.chartInstance.update();
		}
	}
}
