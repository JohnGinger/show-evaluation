function getAllResultsForAPaper(applicableTasks, paperTitle) {
  return applicableTasks.map(x => ({
    task: x.task,
    datasets: x.datasets
      .filter(
        dataset =>
          dataset.sota &&
          dataset.sota.sota_rows.some(x => x.paper_title === paperTitle)
      )
      .map(dataset => ({
        dataset: dataset.dataset,
        papers: dataset.sota.sota_rows
      }))
  }));
}
export default getAllResultsForAPaper;
