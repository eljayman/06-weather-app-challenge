// global variables
var currentTime = dayjs();
var SEARCHED_CITIES = [];

// global selectors
var currentCityHead = document.getElementById("city-info");
var searchButton = document.getElementById("submit");
var previousSearchEl = document.getElementById("previous-searches");
var citySearch = document.querySelector(".search");

//make buttons at start
function startPage() {
  let searches = localStorage.getItem("cities");
  if (searches.valueOf != "") {
    SEARCHED_CITIES = JSON.parse(searches);
    console.log(SEARCHED_CITIES);
    createSearchedBut();
  }
}
//function for search button
function searchButtonClick(e) {
  if (citySearch.value != "") {
    e.preventDefault();
    var searchCity = citySearch.value;
    // geoTagGetter(searchCity);
    storeCityInput();
    currentCityHead.innerText = `${citySearch.value} ${currentTime.format(
      "M/D/YYYY"
    )}`;
    localStorage.setItem("cities", JSON.stringify(SEARCHED_CITIES));
    createSearchedBut();
  } else {
    console.log("empty");
  }
}
//function for history buttons
function historyClickSearch(e) {
  if (!e.target.matches(".button-history")) {
    return;
  }

  var targetButton = e.target;
  var searchCity = targetButton.getAttribute("city-search");
  // geoTagGetter(searchCity);
}

function storeCityInput() {
  SEARCHED_CITIES.push(citySearch.value);
}
//create buttons
function createSearchedBut() {
  previousSearchEl.innerHTML = "";
  let i = SEARCHED_CITIES.length - 1;
  for (i; i >= 0; i--) {
    const innerButtonTxt = localStorage.getItem("cities");
    const newButton = document.createElement("button");
    newButton.append(SEARCHED_CITIES[i]);
    newButton.setAttribute("city-search", SEARCHED_CITIES[i]);
    newButton.classList.add("button-history");
    previousSearchEl.append(newButton);
    console.log(innerButtonTxt);
  }
}

function buildBoxes() {
  console.log(data);
}

console.log(currentTime.format("M/D/YYYY"));

startPage();
searchButton.addEventListener("click", searchButtonClick);
previousSearchEl.addEventListener("click", historyClickSearch);
