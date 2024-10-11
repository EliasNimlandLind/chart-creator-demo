# chart-js-sample

## Features:

- Responsive
- Made for the web
- Zoom and pan functionality
- Customizable

## About this project

The project is used to visualize data using charts and graphs by instaniating ´chartGenerator.js´ with configuration values such as chart type and unit. By clicking on a data point in the displayed chart a new chart containing data about the clicked data point.

## Technology stack

- Node.js
- Vite
- Javascript
- CSS
- HTML

## Usage guide

Below is a basic sample to illustrate usage.

```javascript
const datasets = [
	{
		label: 'Dataset A',
		data: [152, 181, 112],
	},
];

const chartContext = document.getElementById('line-chart');
const chartGenerator = new ChartGenerator(
	chartContext,
	'line',
	'pie',
	datasets,
	'kr'
);
chartGenerator.generateChart();
```
