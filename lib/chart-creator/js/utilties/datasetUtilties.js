const sumArray = (array) => {
	const sumArray = array.reduce((sum, value) => sum + value, 0);
	return sumArray;
};

export const getLargestDataInDatasets = (datasets) => {
	let largestDataset = datasets[0];
	let maxSum = sumArray(datasets[0].data);

	for (let datasetIndex = 1; datasetIndex < datasets.length; datasetIndex++) {
		const currentSum = sumArray(datasets[datasetIndex].data);
		if (currentSum > maxSum) {
			maxSum = currentSum;
			largestDataset = datasets[datasetIndex];
		}
	}
	return largestDataset.data;
};
