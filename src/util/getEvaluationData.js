import { parse, format } from "date-fns";

function getEvaluationData(validDatasets, paperTitle) {
  let graphData = {};
  let selectedPaperData = {};
  let evaluationRows = [];
  for (let { task, datasets } of validDatasets) {
    for (let { dataset, papers } of datasets) {
      let globalRank = 1;
      for (let paper of papers) {
        for (let [metricName, metricValue] of Object.entries(paper.metrics)) {
          const key = `${clean(task)}-${clean(dataset)}-${clean(metricName)}`;
          const cleanedValue = Number(metricValue.replace(/[^0-9.]/g, ""));
          const date = Number(parse(paper.paper_date));
          const dateString = format(date, "DD MMM YY");
          if (paper.paper_title === paperTitle) {
            evaluationRows.push({
              task,
              dataset,
              model: paper.model_name,
              metricName,
              metricValue,
              globalRank,
              key
            });

            selectedPaperData[key] = [
              {
                date,
                cleanedValue,
                metricValue,
                metricName,
                paper: paper.paper_title,
                dateString
              }
            ];
          } else {
            graphData[key] = [
              ...(graphData[key] || []),
              {
                date,
                cleanedValue,
                metricValue,
                metricName,
                paper: paper.paper_title,
                dateString
              }
            ];
          }
        }
        globalRank += 1;
      }
    }
  }
  return { evaluationRows, graphData, selectedPaperData };
}
export default getEvaluationData;

const clean = input => input.toLowerCase().replace(/[^a-z]/g, "");
