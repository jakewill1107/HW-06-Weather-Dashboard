// Initialization 
// Getting search history from local storage
var cityList = JSON.parse(localStorage.getItem("city-list"));
// If there is no data, the list will display empty
if (!cityList) {
    cityList = [];
}
console.log("city-list")
console.log(cityList); 

// UV condition function 
function uvCondition(value) {
    if (value < 2.5) {
        return "uv-low";
    }
    else if (value < 5.5) {
        return "uv-moderate";
    }
    else if (value < 7.5) {
        return "uv-high";
    }
    else if (value <10.5) {
        return "uv-vhigh";
    }
    else {
        return "uv-extreme";
    }
}

// Search history function
function renderSearchHistory() {
    // Clears search history
    $("#search-history").empty();
    // Cycles through city list
    $.each(cityList, function(index, city) {
        // Creates a list item
        var liEl = $('<li class="search-item">').text(city);
        $("search-history").append(liEl);
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
if (listLength >8) {
     cityList.pop();
}
// Stores the list in local storage
localStorage.setItem("city-list", JSON.stringify(cityList));

// Displays search history
renderSearchHistory();
}

