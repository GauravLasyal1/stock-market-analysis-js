//script related to display plotly
export function plotGraph(xAxisData, yAxisData) {
  var trace1 = {
    x: xAxisData,
    y: yAxisData,
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "blue" },
  };

  var data = [trace1];

  var layout = {
    xaxis: {
      showgrid: false,
    },
    yaxis: {
      showgrid: false,
    },
  };

  Plotly.newPlot("myPlot", data, layout, {
    responsize: true,
    displayModeBar: false,
  });
}
