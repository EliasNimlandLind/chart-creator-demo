import ChartGenerator from './chartGenerator.js';
const costDatasets = [
  {
    type: 'Mjöl',
    prices: [
      25, 24, 26, 27, 24, 30, 28, 25, 27, 29, 26, 25, 24, 23, 26, 27, 28, 29,
      25, 26, 24, 27, 28, 26, 25, 24, 23, 25, 24, 25,
    ],
  },
  {
    type: 'Jäst',
    prices: [
      10, 11, 10, 12, 10, 11, 9, 10, 12, 11, 10, 9, 8, 10, 11, 12, 11, 10, 9, 8,
      10, 11, 12, 11, 10, 9, 10, 11, 10, 9,
    ],
  },
  {
    type: 'Salt',
    prices: [
      5, 5, 4, 5, 6, 5, 5, 4, 5, 5, 6, 5, 4, 5, 5, 4, 5, 6, 5, 4, 5, 5, 4, 5, 6,
      5, 4, 5, 5, 4,
    ],
  },
  {
    type: 'Vatten använt i bakning',
    prices: [
      1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 1, 4, 2, 1, 1, 1, 2, 1, 1, 1, 2, 4,
      1, 3, 2, 1, 1,
    ],
  },
  {
    type: 'Socker',
    prices: [
      7, 6, 7, 8, 6, 7, 8, 7, 6, 8, 7, 6, 7, 8, 6, 7, 8, 7, 6, 8, 7, 6, 8, 7, 6,
      7, 8, 6, 7, 8,
    ],
  },
  {
    type: 'Smör',
    prices: [
      18, 19, 20, 18, 17, 18, 19, 20, 18, 19, 20, 21, 19, 18, 20, 19, 18, 20,
      21, 20, 19, 18, 19, 20, 18, 19, 20, 21, 19, 18,
    ],
    type: 'Elektricitet',
    prices: [
      30, 31, 29, 30, 32, 30, 31, 29, 30, 31, 29, 30, 32, 30, 29, 31, 30, 29,
      30, 31, 29, 30, 32, 31, 30, 29, 30, 31, 32, 30,
    ],
  },
  {
    type: 'Övrigt vatten',
    prices: [
      15, 14, 15, 14, 15, 16, 14, 15, 14, 15, 16, 15, 14, 15, 14, 15, 16, 14,
      15, 14, 15, 16, 15, 14, 15, 16, 15, 14, 15, 14,
    ],
  },
];

const revenueDatasets = [
  {
    type: 'Intäkter',
    profits: [
      152, 181, 112, 116, 110, 110, 211, 111, 110, 87, 81, 80, 80, 110, 111,
      219, 196, 171, 110, 111, 111, 214, 111, 111, 110, 85, 82, 111, 88, 215,
    ],
  },
];

const chartGenerator = new ChartGenerator(
  'bread-chart',
  'line',
  costDatasets,
  revenueDatasets
);

function sumDatasetValues(dataset, key) {
  const reducedDatasets = dataset.reduce((total, currentDataset) => {
    if (currentDataset[key]) {
      return (
        total +
        currentDataset[key].reduce((accoumulated, value) => {
          return accoumulated + value;
        }, 0)
      );
    }
    return total;
  }, 0);
  return reducedDatasets;
}

const profitMargin = document.createElement('p');
const profitMarginPercentage =
  ((sumDatasetValues(revenueDatasets, 'profits') -
    sumDatasetValues(costDatasets, 'prices')) /
    sumDatasetValues(revenueDatasets, 'profits')) *
  100;
profitMargin.innerText = 'Vinstmarginal: ' + profitMarginPercentage + '%';

if (profitMarginPercentage > 25) {
  profitMargin.style.color = 'green';
} else if (profitMarginPercentage > 20) {
  profitMargin.style.color = 'yellow';
} else {
  profitMargin.style.color = 'red';
}
document.body.appendChild(profitMargin);

// Generate the initial chart
chartGenerator.generateChart();
