// Initialization 
// Getting search history from local storage
var cityList = JSON.parse(localStorage.getItem("city-list"));
// If there is no data, the list will display empty
if (!cityList) {
    cityList = [];
}
console.log(cityList); 

