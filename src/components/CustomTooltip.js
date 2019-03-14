import React from "react";
import "./CustomTooltip.scss";

const CustomTooltip = ({ active, payload }) => {
  if (active) {
    const itemData = payload[0].payload;
    return (
      <tooltip-container>
        <h3>{itemData.paper}</h3>
        <metric-value>
          {itemData.metricName}: {itemData.metricValue} ({itemData.dateString})
        </metric-value>
      </tooltip-container>
    );
  }

  return null;
};
export default CustomTooltip;
