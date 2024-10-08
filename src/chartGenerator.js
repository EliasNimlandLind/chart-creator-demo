import { Chart } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

import './pieChart.css';
import './breadChart.css';

Chart.register(zoomPlugin);

export class ChartGenerator {
  constructor(
    canvasId,
    chartType,
    costDatasets = [],
    revenueDatasets = [],
    xAxisLabel = 'Dag',
    yAxisLabel = 'Pris (kr)'
  ) {
    this.canvasId = canvasId;
    this.chartType = chartType;

    this.costDatasets = costDatasets;
    this.revenueDatasets = revenueDatasets;
    this.combinedPricesData = this.getCombinedPricesData();
    this.colorScheme = this.getColorScheme(
      costDatasets.length + revenueDatasets.length
    );

    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
    this.chartInstance = null;
    this.pieChartInstance = null;
  }

  getCombinedPricesData() {
    const days = [...Array(30)].map((_, dayIndex) => `${dayIndex + 1}`);

    const combinedData = {
      days,
      prices: {},
    };

    this.costDatasets.forEach((dataset) => {
      combinedData.prices[dataset.type] = dataset.prices;
    });

    this.revenueDatasets.forEach((dataset) => {
      combinedData.prices[dataset.type] = dataset.profits; // Assuming profits are structured similarly
    });

    return combinedData;
  }

  randomColorValue = () => {
    return Math.floor(Math.random() * 256);
  };

  getColorScheme(amountOfColors) {
    const colors = [];

    for (let colorIndex = 0; colorIndex < amountOfColors; colorIndex++) {
      const red = this.randomColorValue();
      const green = this.randomColorValue();
      const blue = this.randomColorValue();
      const alpha = 1;
      const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      colors.push(color);
    }
    return colors;
  }

  processDataSets(data, colors) {
    return Object.keys(data).map((key, index) => ({
      label: key,
      data: data[key],
      borderColor: colors[index % colors.length],
      borderWidth: 1,
      fill: false,
      pointRadius: 5,
      pointBackgroundColor: colors[index % colors.length],
    }));
  }

  getCanvas = (canvasId) => {
    const canvas =
      document.getElementById(canvasId) || document.createElement('canvas');
    return canvas;
  };

  generateChart() {
    const lineChartCanvas = this.getCanvas(this.canvasId)?.getContext('2d');

    const processedDatasets = this.processDataSets(
      this.combinedPricesData.prices,
      this.colorScheme
    );
    const labels = this.combinedPricesData.days;

    this.chartInstance = new Chart(lineChartCanvas, {
      type: this.chartType,
      data: {
        labels,
        datasets: processedDatasets,
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                return `${this.xAxisLabel} ${labels[index]}`;
              },
              label: (tooltipItem) => {
                const price = tooltipItem.raw;
                const datasetLabel = tooltipItem.dataset.label;
                return `${datasetLabel}: ${price} kr`;
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
              mode: 'x',
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
              text: this.xAxisLabel,
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: this.yAxisLabel,
            },
          },
        },
      },
    });

    lineChartCanvas.canvas.addEventListener('click', (event) => {
      const activePoints = this.chartInstance.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        false
      );

      if (activePoints.length) {
        const clickedIndex = activePoints[0].index;
        this.updatePieChart(clickedIndex);

        const pieChartCanvas = document.getElementById('pie-chart');
        if (pieChartCanvas && pieChartCanvas.style.display === 'none') {
          pieChartCanvas.style.display = 'block';
        }
      }
    });
  }

  updatePieChart(dayIndex) {
    const pieChartId = 'pie-chart';
    const pieChartCanvas = this.getCanvas(pieChartId);

    if (!document.getElementById(pieChartId)) {
      pieChartCanvas.id = pieChartId;
      pieChartCanvas.style.display = 'block';
      document.body.appendChild(pieChartCanvas);
    }

    const pieChartContext = pieChartCanvas.getContext('2d');

    const labels = [
      ...this.costDatasets.map((dataset) => dataset.type),
      ...this.revenueDatasets.map((dataset) => dataset.type),
    ];
    const data = [
      ...this.costDatasets.map((dataset) => dataset.prices[dayIndex]),
      ...this.revenueDatasets.map((dataset) => dataset.profits[dayIndex]),
    ];

    if (this.pieChartInstance) {
      this.pieChartInstance.data.labels = labels;
      this.pieChartInstance.data.datasets[0].data = data;
      this.pieChartInstance.options.plugins.title.text = `${
        this.yAxisLabel
      } för dag ${dayIndex + 1}`;

      this.pieChartInstance.update();
      return;
    }

    this.pieChartInstance = new Chart(pieChartContext, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: `${this.yAxisLabel}`,
            data,
            backgroundColor: this.colorScheme,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const datasetLabel = tooltipItem.label;
                const price = tooltipItem.raw;
                return `${datasetLabel}: ${price} kr`;
              },
            },
          },
        },
      },
    });

    pieChartCanvas.addEventListener('click', () => {
      pieChartCanvas.style.display = 'none';
    });
  }
}

export default ChartGenerator;
