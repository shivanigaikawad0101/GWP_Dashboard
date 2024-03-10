function populateTableData() {
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
        const openMarketTableData = [
          jsonData[0],
          ...jsonData
            .filter((row) => row[4] === "Open Market")
            .sort((a, b) => b[2] - a[2]),
        ];
        populateTable(openMarketTableData, "open-market-table");
        const faclilitiesTableData = [
          jsonData[0],
          ...jsonData
            .filter((row) => row[4] === "Facilities")
            .sort((a, b) => b[2] - a[2]),
        ];
        populateTable(faclilitiesTableData, "facilities-table");
        populateTable(
          jsonData.sort((a, b) => b[2] - a[2]),
          "combined-table",
        );
      };

      reader.readAsArrayBuffer(blob);
    }
  };

  // Send the request
  xhr.send();
}

function populateTable(data, tableId) {
  // Populate top 10 brokers table
  const brokerTable = document.getElementById(tableId);
  const brokerTableHead = document.createElement("thead");
  const headData = data && data[0];
  const headRow = document.createElement("tr");
  headData.forEach((element) => {
    const th = document.createElement("th");
    th.textContent = element;
    headRow.appendChild(th);
  });
  const th = document.createElement("th");
  th.textContent = "% of actual to planned GWP";
  headRow.appendChild(th);
  brokerTableHead.appendChild(headRow);
  brokerTable.appendChild(brokerTableHead);
  const brokerTableBody = document.createElement("tbody");
  const bodyData = data && data.slice(1, 11);
  bodyData.forEach((rowData) => {
    const tr = document.createElement("tr");
    rowData.forEach((element, index) => {
      const td = document.createElement("td");
      td.textContent =
        index === 2 || index === 3
          ? `${(+element / 1000).toFixed(1)} K`
          : element;
      tr.appendChild(td);
    });
    const percentageGWP = `${(
      ((+rowData[3] - +rowData[2]) / +rowData[3]) *
      100
    ).toFixed(2)} %`;
    const td = document.createElement("td");
    td.textContent = percentageGWP;
    tr.appendChild(td);
    brokerTableBody.appendChild(tr);
  });
  brokerTable.appendChild(brokerTableBody);
}

document
  .getElementById("top-brokers-select")
  .addEventListener("change", function () {
    const options = [
      "open-market-div",
      "facilities-div",
      "open-market-and-facilities-div",
    ];
    options.forEach((option) => {
      if (option === this.value) {
        document.getElementById(option).style.display = "block";
        document.getElementById(option).style.width = "100%";
      } else if (this.value === "all") {
        document.getElementById(option).style.display = "block";
      } else {
        document.getElementById(option).style.display = "none";
      }
    });
  });

populateTableData();
