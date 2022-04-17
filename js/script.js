const cityFormEl = document.querySelector("#searching")
const weatherData = document.querySelector("#weather-summary")
const rootUrl = 'https://api.openweathermap.org';
const apiKey ='ffb1997b031804bb94db3209b18b6613'
let limit = 5;
let lat;
let lon;

cityFormEl.addEventListener("submit", function(event){
    event.preventDefault();
    let userCityName= event.target[0].value
    console.log(event)
    console.log(event.target)
    console.log
    getCity(userCityName)
})

console.log("Testing")
var getCity = function(cityName){
    let cityUrl=`${rootUrl}/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`
    fetch(cityUrl).then(function(response){
        return response.json().then(function(data){
        console.log(data, cityName) 
        lat = data[0].lat
        lon = data[0].lon
        console.log(lat, lon)
        getWeather(lat, lon); 
        })
})
}