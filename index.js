import { Chart } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';

import LineChartZoom from './lib/chart-creator/js/extendedCharts/lineChartZoom';

Chart.register(zoomPlugin, annotationPlugin);

const updatingDatasets = [
	{
		label: 'Dataset A',
		data: [],
	},
	{
		label: 'Dataset B',
		data: [0],
	},
];

const updatingChartContext = document.getElementById('second-line-chart');
const updatingLineChartZoom = new LineChartZoom(
	updatingChartContext,
	'line',
	'pie',
	updatingDatasets,
	'SEK',
	'Day',
	1.2,
	1.5
);

updatingLineChartZoom.generateChart();

const generateMockData = () => {
	return Math.random() * 10;
};

const UpdateZoomChart = () => {
	const mockData = generateMockData();
	updatingLineChartZoom.lineChart.update(mockData);
};

setInterval(UpdateZoomChart, 100);
