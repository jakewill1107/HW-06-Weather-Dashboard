// Getting search history from local storage
var cityList = JSON.parse(localStorage.getItem("city-list"));
// If there is no data, the list will display empty
if (!cityList) {
  cityList = [];
}
console.log("city-list");
console.log(cityList);

// Function for setting UV condition
function uvCondition(value) {
  if (value < 2.5) {
    return "uv-low";
  } else if (value < 5.5) {
    return "uv-moderate";
  } else if (value < 7.5) {
    return "uv-high";
  } else if (value < 10.5) {
    return "uv-vhigh";
  } else {
    return "uv-extreme";
  }
}

// Function that starts the code by rendering search history
function renderSearchHistory() {
  // Clears search history
  $("#search-history").empty();
  // Cycles through city list
  $.each(cityList, function (index, city) {
    // Creates a list item and appends to html
    var liEl = $('<li class="search-item">').text(city);
    $("#search-history").append(liEl);
  });
}

// Function updating search history
function updateSearchHistory(cityName) {
  // Removes city from list if already there
  if (cityList.includes(cityName)) {
    cityList.splice(cityList.indexOf(cityName), 1);
  }
  // Adds city to top of list
  var listLength = cityList.unshift(cityName);
  /* Only allows for 8 cities in list, will remove the last one if more added */
  if (listLength > 8) {
    cityList.pop();
  }
  // Stores the list in local storage
  localStorage.setItem("city-list", JSON.stringify(cityList));

  // Displays search history
  renderSearchHistory();
}

// Function for displaying weather by city
function renderWeather(cityName) {
  // gets the URL api
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?appid=de67b8db375cf19f0a90a7d7e6edfda6&units=imperial&q=" +
    cityName;
  // Ajax query
  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then(function (response) {
      // If successful
      console.log(response);
      // Displays current weather info
      $("#city").text(response.name + " (" + moment().format("l") + ")");
      // Icon of current weather
      var iconEl = $('<img class="weather-icon">').attr(
        "src",
        "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
      );
      $("#city").append(iconEl);
      $("#temperature").text("Temperature: " + response.main.temp + "\xb0F");
      $("#humidity").text("Humidity: " + response.main.humidity + "%");
      $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
      $("#uv-index").text("UV Index: ");

      // Displays 5 day forecast using One Call API
      var oneCallURL =
        "https://api.openweathermap.org/data/2.5/onecall?appid=de67b8db375cf19f0a90a7d7e6edfda6&units=imperial&lat=" +
        response.coord.lat +
        "&lon=" +
        response.coord.lon;

      // One Call API query for 5 day forecast
      $.ajax({
        url: oneCallURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        // Displays the UV index
        var uvEl = $("<span>").text(response.current.uvi);
        // Assigns a color class based on UV value
        uvEl.addClass("uv " + uvCondition(response.current.uvi));
        $("#uv-index").append(uvEl);

        //Displays the 5 day forecast
        $(".weather-forecast").attr("style", "display: block");
        // Clears old forecast and adds days
        $(".forecast-days").empty();
        // Starts tomorrow at index 1 and not 0(today)
        for (let i = 1; i < 6; i++) {
          divEl = $('<div class="forecast-day">');
          // Adds date
          var dateEl = $("<h3>").text(moment().add(i, "days").format("l"));
          divEl.append(dateEl);
          // Adds a icon
          var iconEl = $("<img>").attr(
            "src",
            "http://openweathermap.org/img/wn/" +
              response.daily[i].weather[0].icon +
              ".png"
          );
          divEl.append(iconEl);
          // Adds temperature
          var tempEl = $("<p>").text(
            "Temp: " + response.daily[i].temp.day + "\xb0F"
          );
          divEl.append(tempEl);
          // ADds humidity
          var humidityEl = $("<p>").text(
            "Humidity: " + response.daily[i].humidity + "%"
          );
          divEl.append(humidityEl);
          $(".forecast-days").append(divEl);
        }
      });

      // Updating the search history
      updateSearchHistory(response.name);
    })
    .catch(function () {
      $("#city").text("Invalid city name");
      $("#temperature").empty();
      $("#humidity").empty();
      $("#wind-speed").empty();
      $("#uv-index").empty();
      $(".weather-forecast").attr("style", "display: none");
    });
}

// Search button click functionality
$("#search-button").click(function (event) {
  event.preventDefault();

  // Gets a city name from user input text
  var userCity = $("#city-name").val();

  // Display the weather for the user's city input if valid
  renderWeather(userCity);
});

// When a city from the search history is clicked
$(document).on("click", ".search-item", function (event) {
  // Prevent any default action
  event.preventDefault();

  // Gets city name
  var userCity = $(this).text();

  // Displays the current weather and 5-day forecast for that city
  renderWeather(userCity);
});

// Function that starts the code on page load
renderSearchHistory();
