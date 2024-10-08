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
    type: 'Vinst',
    profits: [
      26, 55, 71, 22, 33, 42, 36, 23, 23, 33, 12, 15, 13, 6, 70, 44, 53, 53, 21,
      61, 15, 16, 33, 11, 55, 32, 11, 66, 13, 23,
    ],
  },
];

const chartGenerator = new ChartGenerator(
  'bread-chart',
  'line',
  costDatasets,
  revenueDatasets
);

function sumDatasetValues(datasets, key) {
  // Ensure datasets is not empty and that the specified key exists in the first object
  if (datasets.length > 0 && datasets[0][key]) {
    const values = datasets[0][key]; // Access the array by the specified key

    // Use reduce to sum only integer values
    const total = values
      .filter(Number.isInteger) // Filter out non-integer values
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return total;
  } else {
    console.error(`No ${key} data available in datasets`);
    return 0; // Return 0 if the array under the specified key is undefined
  }
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
