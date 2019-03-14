import React from "react";

const EvaluationTable = ({ evaluationRows, setActiveKey }) => (
  <evaluation-table>
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
              <tr key={key}>
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
  </evaluation-table>
);
export default EvaluationTable;
