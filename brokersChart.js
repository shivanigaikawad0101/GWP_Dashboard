const yearWiseOptions = ["All", 2021, 2022];

function populateChart(data) {
  let svgChart = document.getElementById("my_bar");
  svgChart.innerHTML = "";
  let svg = d3.select(".my_bar");
  let chartContainer = document.getElementById("chart-container");
  var parentWidth = chartContainer.parentNode.parentElement.clientWidth;
  let shape = document.getElementsByTagName("svg")[0];
  shape.setAttribute("viewBox", `0 0 ${parentWidth} 700`);
  let margin = { top: 20, right: 20, bottom: 30, left: 100 },
    width = +parentWidth - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  let y = d3.scaleLinear().rangeRound([height, 0]);
  let x = d3.scaleBand().rangeRound([0, width]).padding(0.8);

  let g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  y.domain([
    0,
    d3.max(data, function (d) {
      return Math.max(d.col1, d.col2);
    }),
  ]);
  x.domain(
    data.map(function (d) {
      return d.letter;
    }),
  );

  g.append("g")
    .attr("class", "axis x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("tickSizeOuter", 0)
    .attr("tickPadding", 10);

  g.append("g").attr("class", "axis y_axis").call(d3.axisLeft(y));

  // Draw bars for col1
  g.selectAll(".bar1")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar1")
    .attr("x", function (d) {
      return x(d.letter) + 10;
    }) // center it
    .attr("width", x.bandwidth() - 20) // make it slimmer
    .attr("y", function (d) {
      return y(d.col1);
    })
    .attr("height", function (d) {
      return height - y(d.col1);
    });

  // Draw bars for col2
  g.selectAll(".bar2")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar2")
    .attr("x", function (d) {
      return x(d.letter);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.col2);
    })
    .attr("height", function (d) {
      return height - y(d.col2);
    });
}

function createRangeArray(lastValue) {
  let result = [];
  let start = 1;
  let end = 10;

  while (start <= lastValue) {
    result.push(`${start}-${Math.min(end, lastValue)}`);
    start += 10;
    end += 10;
  }
  return result;
}

function populateChartFromExcel(option, subOption, range) {
  const excelFilePath = "/excel-data/dashboard-data.xlsx";
  const xhr = new XMLHttpRequest();
  xhr.open("GET", excelFilePath, true);
  xhr.responseType = "blob";
  xhr.onload = function (e) {
    if (this.status === 200) {
      const blob = this.response;
      const reader = new FileReader();

      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        let filedata = [...jsonData];
        if (option) {
          filedata = filedata.filter((element) => element[4] === option);
        }
        if (subOption) {
          filedata = filedata.filter((element) => +element[0] === +subOption);
        }
        if (!range) {
          const length = filedata.length;
          let rangeArray = createRangeArray(length);
          const dataIndexWise = document.getElementById("data-index-wise");
          dataIndexWise.innerHTML = "";
          rangeArray.forEach((element) => {
            const indexWiseSelectOptions = document.createElement("option");
            indexWiseSelectOptions.value = element;
            indexWiseSelectOptions.text = element;
            dataIndexWise.appendChild(indexWiseSelectOptions);
          });
        }
        let slice = [1, 10];
        if (range) {
          slice = range.split("-");
          slice = [slice[0] - 1, slice[1]];
        }
        const chartData = filedata.slice(slice[0], slice[1]).map((element) => ({
          letter: `${element[1]} - ${element[4]} (${element[0]})`,
          col1: +element[2],
          col2: +element[3],
        }));

        populateChart(chartData);
      };

      reader.readAsArrayBuffer(blob);
    }
  };
  xhr.send();
}

document.getElementById("market-type").addEventListener("change", function () {
  const yearWiseSelect = document.getElementById("year-wise");
  yearWiseSelect.innerHTML = "";
  yearWiseOptions.forEach((element) => {
    const yearWiseSelectOptions = document.createElement("option");
    yearWiseSelectOptions.value = element;
    yearWiseSelectOptions.text = element;
    yearWiseSelect.appendChild(yearWiseSelectOptions);
  });
  populateChartFromExcel(this.value === "All" ? "" : this.value);
});

document.getElementById("year-wise").addEventListener("change", function () {
  const marketTypeValue = document.getElementById("market-type").value;
  populateChartFromExcel(
    !marketTypeValue || marketTypeValue === "All" ? "" : marketTypeValue,
    !this.value || this.value === "All" ? "" : this.value,
  );
});

document
  .getElementById("data-index-wise")
  .addEventListener("change", function () {
    const marketTypeValue = document.getElementById("market-type").value;
    var yearWiseValue = document.getElementById("year-wise").value;
    populateChartFromExcel(
      !marketTypeValue || marketTypeValue === "All" ? "" : marketTypeValue,
      !yearWiseValue || yearWiseValue === "All" ? "" : yearWiseValue,
      this.value,
    );
  });

populateChartFromExcel();
