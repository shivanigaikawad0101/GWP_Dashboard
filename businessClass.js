const classStatsOptions = {
  All: ["All"],
  "Financial Institution": ["All", "Crime", "FIPI", "D&O"],
  "Commercial PI": ["PI"],
};

const classStatsIds = {
  year: "",
  "planned-premium": "Planned Premium",
  "earned-premium": "Earned Premium",
  gwp: "GWP",
};

function filteredStatData(data, index, key, option, subOption) {
  let filteredData = [...data];
  if (key) {
    filteredData = filteredData.filter((row) => row[0] === key);
  }
  if (option) {
    filteredData = filteredData.filter((row) => row[1] === option);
  }
  if (subOption) {
    filteredData = filteredData.filter((row) => row[2] === subOption);
  }
  return filteredData.reduce((acc, row) => acc + +row[index], 0);
}

function populateClassStatsData(option, subOption) {
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
        const sheetName = workbook.SheetNames[1];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const totalClassStatsData = [
          "Total",
          filteredStatData(jsonData.slice(1), 3, "", option, subOption),
          filteredStatData(jsonData.slice(1), 4, "", option, subOption),
          filteredStatData(jsonData.slice(1), 5, "", option, subOption),
          ,
        ];
        populateClassStats(totalClassStatsData, "total-class-stats");
        const classStatsData2021 = [
          2021,
          filteredStatData(jsonData.slice(1), 3, 2021, option, subOption),
          filteredStatData(jsonData.slice(1), 4, 2021, option, subOption),
          filteredStatData(jsonData.slice(1), 5, 2021, option, subOption),
        ];
        populateClassStats(classStatsData2021, "class-stats-two-one");
        const classStatsData2022 = [
          2022,
          filteredStatData(jsonData.slice(1), 3, 2022, option, subOption),
          filteredStatData(jsonData.slice(1), 4, 2022, option, subOption),
          filteredStatData(jsonData.slice(1), 5, 2022, option, subOption),
        ];
        populateClassStats(classStatsData2022, "class-stats-double-two");
      };

      reader.readAsArrayBuffer(blob);
    }
  };

  // Send the request
  xhr.send();
}

function populateClassStats(data, tableId) {
  const classStatsCard = document.getElementById(tableId);
  classStatsCard.innerHTML = "";
  data.forEach((element, index) => {
    const classStat = document.createElement("div");
    classStat.className = Object.keys(classStatsIds)[index];
    classStat.style.display = "flex";
    classStat.style.justifyContent = "space-between";
    classStat.style.alignItems = "center";
    if (index) {
      const classStatText = document.createElement("div");
      classStat.className = `${Object.keys(classStatsIds)[index]}-text`;
      classStatText.textContent =
        classStatsIds[Object.keys(classStatsIds)[index]];
      classStat.appendChild(classStatText);
      const classStatValue = document.createElement("div");
      classStatValue.className = `${Object.keys(classStatsIds)[index]}-value`;
      classStatValue.textContent =
        classStatsIds[Object.keys(classStatsIds)[index]];
      classStatValue.textContent = `${(+element / 1000000).toFixed(2)} M`;
      classStat.appendChild(classStatValue);
    } else {
      classStat.textContent = element;
    }
    classStatsCard.appendChild(classStat);
  });
}

document
  .getElementById("business-class")
  .addEventListener("change", function () {
    const classTypesSelect = document.getElementById("class-type");
    classTypesSelect.innerHTML = "";
    classStatsOptions[this.value].forEach((element) => {
      const classTypesSelectOptions = document.createElement("option");
      classTypesSelectOptions.value = element;
      classTypesSelectOptions.text = element;
      classTypesSelect.appendChild(classTypesSelectOptions);
    });
    populateClassStatsData(
      !this.value || this.value === "All" ? "" : this.value,
      "",
    );
  });

document.getElementById("class-type").addEventListener("change", function () {
  const classTypeValue = document.getElementById("business-class").value;
  populateClassStatsData(
    !classTypeValue || classTypeValue === "All" ? "" : classTypeValue,
    !this.value || this.value === "All" ? "" : this.value,
  );
});

populateClassStatsData();
