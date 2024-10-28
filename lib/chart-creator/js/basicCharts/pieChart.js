import { BaseChart } from './BaseChart';

export class PieChart extends BaseChart {
	constructor(colors, titleText, chartCanvas, dataset, dataUnit) {
		super(colors, chartCanvas, dataUnit);
		this.titleText = titleText;
		this.dataset = dataset;
	}

	getOptions = () => ({
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: this.titleText,
			},
			tooltip: {
				callbacks: {
					label: (tooltipItem) => {
						const datasetLabel = tooltipItem.label;
						const datasetPointData = tooltipItem.raw;
						return `${datasetLabel}: ${datasetPointData} ${this.dataUnit}`;
					},
				},
			},
		},
	});

	generate = () => {
		this.generateBase(this.dataset, this.getOptions(), 'pie');
	};
}
