import React, { useState } from "react";
import data from "./evaluation-tables.json";
import EvaluationTable from "components/EvaluationTable";
import ResultsInContext from "components/ResultsInContext";
import getAllResultsForAPaper from "util/getAllResultsForAPaper";
import getEvaluationData from "util/getEvaluationData";
import getTasksForPaper from "util/getTasksForPaper";

import "./App.scss";

const DisplayResults = () => {
  const [paperTitle, setPaperTitle] = useState(
    "Language Models are Unsupervised Multitask Learners"
  );

  const applicableTasks = getTasksForPaper(data, paperTitle);
  const validDatasets = getAllResultsForAPaper(applicableTasks, paperTitle);
  let { evaluationRows, graphData, selectedPaperData } = getEvaluationData(
    validDatasets,
    paperTitle
  );

  const [activeKey, setActiveKey] = useState("");

  return (
    <div>
      <paper-selector>
        <input
          value={paperTitle}
          onChange={e => setPaperTitle(e.target.value)}
        />
      </paper-selector>
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
