import { getLargestDataInDatasets } from './../utilties/datasetUtilties';
import { generateRandomColors } from '../utilties/colorGeneration';

import { LineChart } from '../basicCharts/lineChart';
import { PieChart } from './../basicCharts/pieChart';

export class LineChartZoom {
	constructor(
		context,
		mainChartType,
		zoomChartType,
		datasets,
		dataUnit,
		xAxisUnit,
		yMinBandRange,
		ymaxBandRange,
		xAxisType = 'linear',
		yAxisType = 'linear'
	) {
		this.canvas = context;
		this.mainChartType = mainChartType;
		this.zoomChartType = zoomChartType;
		this.datasets = datasets;
		this.dataUnit = dataUnit;
		this.xAxisUnit = xAxisUnit;
		this.randomColors = generateRandomColors(
			getLargestDataInDatasets(this.datasets).length + 1
		);
		this.xAxisType = xAxisType;
		this.yAxisType = yAxisType;
		this.lineChartInstance = null;

		this.yMinBandRange = yMinBandRange;
		this.ymaxBandRange = ymaxBandRange;

		this.lineChart = new LineChart(
			this.randomColors,
			this.canvas,
			this.datasets,
			this.dataUnit,
			this.xAxisUnit,
			this.xAxisType,
			this.yAxisType,
			this.yMinBandRange,
			this.ymaxBandRange
		);
	}

	generateChart() {
		this.lineChart.generate();

		this.lineChartInstance = this.lineChart.getChartInstance();

		const zoomChartMainContainer = document.createElement('div');
		zoomChartMainContainer.id = 'zoom-chart-main-container';
		document.body.appendChild(zoomChartMainContainer);

		this.#addChartClickListener(zoomChartMainContainer);
	}

	#addChartClickListener(zoomChartMainContainer) {
		if (this.canvas) {
			this.canvas.addEventListener('click', (event) => {
				const activePoints = this.lineChartInstance.getElementsAtEventForMode(
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
					individualZoomChartContainer.id = `${zoomChartId}-div`;
					individualZoomChartContainer.appendChild(zoomChartCanvas);
					individualZoomChartContainer.appendChild(closeButton);
					zoomChartMainContainer.appendChild(individualZoomChartContainer);

					const clickedIndex = activePoints[0].index;
					this.#updateZoomChart(clickedIndex, zoomChartCanvas);

					closeButton.addEventListener('click', () => {
						individualZoomChartContainer.remove();
					});
				}
			});
		} else {
			console.error('Canvas element is not available.');
		}
	}

	#updateZoomChart(clickedDataPointIndex, zoomChartCanvas) {
		const colors = this.randomColors;
		const data = this.datasets.map(
			(dataset) => dataset.data[clickedDataPointIndex]
		);

		const chartData = {
			labels: this.datasets.map((dataset) => dataset.label),
			datasets: [
				{
					data: data,
					backgroundColor: colors,
					borderWidth: 0,
				},
			],
		};

		const zoomChart = new PieChart(
			colors,
			`${this.dataUnit} för ${this.xAxisUnit} ${clickedDataPointIndex + 1}`,
			zoomChartCanvas,
			chartData,
			this.dataUnit,
			this.xAxisUnit
		);

		zoomChart.generate();
	}
}

export default LineChartZoom;
