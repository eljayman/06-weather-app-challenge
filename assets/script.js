// global variables
var currentTime = dayjs();
var SEARCHED_CITIES = [];

// global selectors
var currentCityHead = document.getElementById("city-info");
var searchButton = document.getElementById("submit");
var previousSearchEl = document.getElementById("previous-searches");
var citySearch = document.querySelector(".search");

//make buttons fill at start
function startPage() {
  let searches = localStorage.getItem("cities");
  if (searches) {
    SEARCHED_CITIES = JSON.parse(searches);
    createSearchedBut();
  }
}

//function for search button
function searchButtonClick(e) {
  if (citySearch.value != "") {
    e.preventDefault();
    var searchCity = citySearch.value;
    geoTagGetter(searchCity);
    storeCityInput();
    localStorage.setItem("cities", JSON.stringify(SEARCHED_CITIES));
    createSearchedBut();
  }
}
//function for history buttons
function historyClickSearch(e) {
  if (!e.target.matches(".button-history")) {
    return;
  }
  var targetButton = e.target;
  var searchCity = targetButton.getAttribute("city-search");
  geoTagGetter(searchCity);
}
// adds new cities to array
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
  }
}
//fetches latitude and longitude
function geoTagGetter(searchCity) {
  var geoTagURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchCity},&limit=3&appid=9d210472671fcdc77c0c14f3da00bbf0`;

  fetch(geoTagURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("Location not found");
      } else {
        weatherGetter(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}
// fetches weather data
function weatherGetter(location) {
  const city = location.name;
  const lat = location.lat;
  const lon = location.lon;
  const weatherGetURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=9d210472671fcdc77c0c14f3da00bbf0`;
  fetch(weatherGetURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      buildBoxes(city, data);
      currentCityHelper(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}
// builds forecast boxes
function buildBoxes(city, data) {
  const weatherData = data.list;
  const fiveDayDiv = document.getElementById("5-day-forecast");
  fiveDayDiv.innerHTML = "";
  for (let i = 7; i <= weatherData.length; i += 8) {
    let newBox = document.createElement("div");
    newBox.setAttribute("class", "day-box");
    let newBoxDate = document.createElement("h4");
    newBoxDate.setAttribute("class", "day-box-date");
    let iconWeatherDay = weatherData[i].weather[0].icon;
    let iconDayURL = ` https://openweathermap.org/img/wn/${iconWeatherDay}.png`;
    let currentCityIconDay = document.createElement("img");
    currentCityIconDay.setAttribute("src", iconDayURL);
    newBoxDate.innerHTML = `${dayjs(weatherData[i].dt_txt).format(
      "M/D/YYYY"
    )}<br/>`;
    newBoxDate.append(currentCityIconDay);
    let newBoxTemp = document.createElement("p");
    newBoxTemp.setAttribute("class", "day-box-temp");
    newBoxTemp.innerHTML = `Temp: ${weatherData[i].main.temp} &#8457;`;
    let newBoxWind = document.createElement("p");
    newBoxWind.setAttribute("class", "day-box-wind");
    newBoxWind.innerHTML = `wind: ${weatherData[i].wind.speed} mph`;
    let newBoxHum = document.createElement("p");
    newBoxHum.setAttribute("class", "day-box-humidity");
    newBoxHum.innerHTML = `Humidity: ${weatherData[i].main.humidity} %`;
    newBox.append(newBoxDate);
    newBox.append(newBoxTemp);
    newBox.append(newBoxWind);
    newBox.append(newBoxHum);
    fiveDayDiv.append(newBox);
  }
}
// updates current weather
function currentCityHelper(city, data) {
  const iconWeather = data.list[0].weather[0].icon;
  var iconURL = ` http://openweathermap.org/img/wn/${iconWeather}.png`;
  currentCityHead.innerText = `${city} ${currentTime.format("M/D/YYYY")}`;
  var currentCityIcon = document.createElement("img");
  currentCityIcon.setAttribute("src", iconURL);
  currentCityHead.append(currentCityIcon);
  var currentCityTemp = document.getElementById("current-temp");
  currentCityTemp.innerHTML = `Temp: ${data.list[0].main.temp} &#8457;`;
  var currentCityWind = document.getElementById("current-wind");
  currentCityWind.innerHTML = `Wind: ${data.list[0].wind.speed} mph`;
  var currentCityHum = document.getElementById("current-humidity");
  currentCityHum.innerHTML = `Humidity: ${data.list[0].main.humidity} %`;
}

// fire at start
startPage();

// event listeners
searchButton.addEventListener("click", searchButtonClick);
previousSearchEl.addEventListener("click", historyClickSearch);
citySearch.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchButtonClick(e);
  }
});
