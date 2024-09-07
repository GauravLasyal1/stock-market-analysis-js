const stocks = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "PYPL",
  "TSLA",
  "JPM",
  "NVDA",
  "NFLX",
  "DIS",
];
let currentStock;

async function loadList() {
  const response = await fetch(
    "https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata"
  );
  const data = await response.json();
  return data;
}

loadList().then((data) => {
  displayList(data.stocksStatsData[0]);
});

function displayList(stocksStatsData) {
  delete stocksStatsData._id;
  const stockList = document.getElementById("stock-list");

  for (let stock in stocksStatsData) {
    const stockItem = document.createElement("div");
    stockItem.className = "stock-item";
    const stockName = document.createElement("button");
    stockName.textContent = stock;
    stockName.className = "stock-name";
    const bookValue = document.createElement("span");
    bookValue.textContent = `$${stocksStatsData[stock].bookValue.toFixed(2)}`;
    bookValue.className = "book-value";
    const profit = document.createElement("span");
    profit.textContent = `${stocksStatsData[stock].profit.toFixed(3)}%`;
    if (stocksStatsData[stock].profit > 0.0)
      profit.className = "profit  green-color";
    else profit.className = "profit red-color";
    stockItem.append(stockName, bookValue, profit);
    stockList.appendChild(stockItem);
    stockName.addEventListener("click", () => {
      currentStock = stock;
      fetchStockData(stock);
      loadDetails(stock, stocksStatsData[stock]);
    });
  }
}

function loadDetails(stockName, stockInfo) {
  document.getElementById("uname").textContent = stockName;
  const uprofit = document.getElementById("uprofit");
  uprofit.textContent = `${stockInfo.profit.toFixed(3)}%`;
  if (stockInfo.profit > 0.0) {
    uprofit.classList.add("green-color");
  } else {
    uprofit.classList.add("red-color");
  }
  document.getElementById(
    "ubook-value"
  ).textContent = `$${stockInfo.bookValue}`;

  loadSummary(stockName);
}

async function loadSummary(stockName) {
  const response = await fetch(
    "https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata"
  );
  let data = await response.json();
  data = data.stocksProfileData[0];
  data = data[stockName].summary;
  document.querySelector(".lower").textContent = data;
}

function fetchStockData(stockName, stockDuration = "5y") {
  async function loadData() {
    const response = await fetch(
      "https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata"
    );
    let data = await response.json();
    data = data.stocksData[0][stockName][stockDuration];
    return data;
  }
  loadData().then((data) => {
    generateCoordinatesWithTimestamp(data);
  });
}

function generateCoordinatesWithTimestamp(data) {
  //x will be timestamp, y will be value
  let xCoordidates = [];
  let yCoordinates = [...data.value];
  xCoordidates = data.timeStamp.map((time) => {
    return new Date(time * 1000).toLocaleDateString();
  });
  plotGraph(xCoordidates, yCoordinates);
}

function plotGraph(xAxisData, yAxisData) {
  var trace1 = {
    x: xAxisData,
    y: yAxisData,
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "blue" },
  };

  var data = [trace1];

  var layout = {
    title: "Basic Line Graph",
    xaxis: {
      title: "X Axis Label",
    },
    yaxis: {
      title: "Y Axis Label",
    },
  };
  Plotly.newPlot("myPlot", data, layout);
}

document.getElementById("one-month").addEventListener("click", () => {
  fetchStockData(currentStock, "1mo");
});

document.getElementById("three-month").addEventListener("click", () => {
  fetchStockData(currentStock, "3mo");
});

document.getElementById("one-year").addEventListener("click", () => {
  fetchStockData(currentStock, "1y");
});

document.getElementById("five-year").addEventListener("click", () => {
  fetchStockData(currentStock, "5y");
});
