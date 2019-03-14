import React from "react";
import CustomTooltip from "./CustomTooltip";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter
} from "recharts";
import { parse, format } from "date-fns";

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
      dataKey="cleanedValue"
      type="number"
      domain={["dataMin", "dataMax"]}
    />
    <Scatter data={graphData[activeKey]} fill="#8884d8" />
    <Scatter data={selectedPaperData[activeKey]} fill="#00ff00" />
    <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
  </ScatterChart>
);
export default ResultsInContext;
