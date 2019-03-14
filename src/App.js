import React, { useState } from "react";
import data from "./evaluation-tables.json";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter
} from "recharts";
import "./App.scss";
import { parse, getTime, format } from "date-fns";

const DisplayResults = () => {
  const [paperTitle, setPaperTitle] = useState(
    "Language Models are Unsupervised Multitask Learners"
  );

  let modelName;

  const applicableTasks = data.filter(task =>
    task.datasets.some(
      x => x.sota && x.sota.sota_rows.some(x => x.paper_title === paperTitle)
    )
  );

  const papers = new Set();
  for (let task of data) {
    for (let dataset of task.datasets) {
      if (dataset.sota) {
        for (let paper of dataset.sota.sota_rows) {
          papers.add(paper.paper_title);
          if (paper.paper_title === paperTitle) {
            modelName = paper.model_name;
          }
        }
      }
    }
  }

  const validDatasets = applicableTasks.map(x => ({
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

  let graphData = {};
  let selectedPaperData = {};
  let evaluationRows = [];

  const clean = input => input.toLowerCase().replace(/[^a-z]/g, "");

  for (let { task, datasets } of validDatasets) {
    for (let { dataset, papers } of datasets) {
      let i = 0;
      for (let paper of papers) {
        for (let [metricName, metricValue] of Object.entries(paper.metrics)) {
          const key = `${clean(task)}-${clean(dataset)}-${clean(metricName)}`;
          const value = Number(metricValue.replace(/[^0-9.]/g, ""));
          const date = getTime(parse(paper.paper_date));
          if (paper.paper_title === paperTitle) {
            evaluationRows.push({
              task,
              dataset,
              model: paper.model_name,
              metricName,
              metricValue,
              globalRank: i + 1,
              key
            });
            selectedPaperData[key] = [
              {
                date,
                metricValue: value,
                valueString: metricValue,
                metricName,
                modelName: paper.model_name,
                dateString: format(parse(date), "DD MMM YY")
              }
            ];
          } else {
            graphData[key] = [
              ...(graphData[key] || []),
              {
                date,
                metricValue: value,
                valueString: metricValue,
                metricName,
                modelName: paper.model_name,
                dateString: format(parse(date), "DD MMM YY")
              }
            ];
          }
        }
        i += 1;
      }
    }
  }

  const [activeKey, setActiveKey] = useState("");

  return (
    <div className="App">
      <input
        value={paperTitle}
        onChange={e => setPaperTitle(e.target.value)}
        className="paperSelector"
      />
      <info-block>
        <h2>Tasks</h2>
        <content-container>
          {applicableTasks.map(x => (
            <task-lozenge key={x.task}>{x.task}</task-lozenge>
          ))}
        </content-container>
      </info-block>
      <evaluation-block>
        <h2>Evaluation</h2>
        <content-container>
          <EvaluationTable
            evaluationRows={evaluationRows}
            setActiveKey={setActiveKey}
          />
          <ResultsInContext
            graphData={graphData}
            activeKey={activeKey}
            selectedPaperData={selectedPaperData}
          />
        </content-container>
      </evaluation-block>
    </div>
  );
};

export default DisplayResults;

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <tooltip-container>
        <h3>{payload[0].payload.modelName}</h3>
        <metric-value>
          {payload[0].payload.metricName}: {payload[0].payload.valueString} (
          {payload[0].payload.dateString})
        </metric-value>
      </tooltip-container>
    );
  }

  return null;
};

const EvaluationTable = ({ evaluationRows, setActiveKey }) => (
  <table>
    <thead>
      <tr>
        <th>Task</th>
        <th>Dataset</th>
        <th>Model</th>
        <th>Metric name</th>
        <th>Metric value</th>
        <th>Global rank</th>
      </tr>
    </thead>
    <tbody>
      {evaluationRows.map(
        ({
          task,
          dataset,
          model,
          metricName,
          metricValue,
          globalRank,
          key
        }) => {
          return (
            <tr className="evalaution-row" key={key}>
              <td>{task}</td>
              <td>{dataset}</td>
              <td>{model}</td>
              <td>{metricName}</td>
              <td>{metricValue}</td>
              <td>{globalRank}</td>
              <td>
                <button onClick={() => setActiveKey(key)}>
                  Show in Context
                </button>
              </td>
            </tr>
          );
        }
      )}
    </tbody>
  </table>
);

const ResultsInContext = ({ graphData, activeKey, selectedPaperData }) => (
  <ScatterChart
    width={600}
    height={250}
    margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
    className="graph"
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      dataKey="date"
      name="date"
      type="number"
      tickFormatter={e => format(parse(e), "MMM YY")}
      minTickGap={0}
      domain={["dataMin", "dataMax"]}
    />
    <YAxis
      dataKey="metricValue"
      name="metric-value"
      type="number"
      domain={["dataMin", "dataMax"]}
    />
    <Scatter data={graphData[activeKey]} fill="#8884d8" />
    <Scatter data={selectedPaperData[activeKey]} fill="#00ff00" />
    <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
  </ScatterChart>
);
