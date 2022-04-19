const cityInputEl = document.querySelector("#city")
const cityFormEl = document.querySelector("#city-search")
const searchBtnEl = document.querySelector(".btn")
const savedSearch = document.querySelector("saved-search")
const weatherData = document.querySelector("#current-weather")
const fiveForecastEl = document.querySelector("#five-day-forecast")


const cityName = document.querySelector("#city-name")
const weatherImage = document.querySelector("#weather-img")
const date = document.querySelector("#current-date")
const temp = document.querySelector("#city-temp")
const wind = document.querySelector("#city-ws")
const humidity = document.querySelector("#city-humidity")
const uv = document.querySelector("#current-uv")


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
    getCity(userCityName)
})

var getCity = function(cityName){
    let cityUrl=`${rootUrl}/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`
    fetch(cityUrl).then(function(response){
        return response.json().then(function(data){
        let currentDate = dayjs().format('M/DD/YYYY')
        cityName.textContent = response.name + " " + currentDate
        console.log(data, cityName) 
        lat = data[0].lat
        lon = data[0].lon
        console.log(lat, lon)
        getWeather(lat, lon); 
        })
})
}
var getWeather = function(lat, lon){
    let forecastUrl = `${rootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    fetch(forecastUrl).then(function(response){
        return response.json().then(function(data){
            console.log(data, "FORECAST");
            
            let temp = data.current.temp
            let windspeed = data.current.wind_speed
            let humidity = data.current.humidity
            let uvIndex = data.current.uvi
            // let icon = data.current.weather[0].icon;
            let iconData = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
                forecastPopulate(iconData, temp, windspeed, humidity, uvIndex);
                fiveDayForecast(data.daily)
                })
            })    
        }

var forecastPopulate = function (icon, temp, windspeed, humidity, uvIndex) {
    const dayBox = document.createElement("div");
    const fetchData = [icon, temp, windspeed, humidity, uvIndex];
    for (let i = 0; i < 5; i++){
        if(i === 0){

            let iconBox = document.createElement("img");
            iconBox.src = fetchData[i];
            dayBox.append(iconBox);
            console.log(iconBox)
        }else {
            let dataBox = document.createElement("div");
            dataBox.textContent = fetchData[i]
            weatherData.append(dataBox);
        }
    }
//     let weatherIcon = document.createElement("img")
        weatherData.append(dayBox)
    }
var fiveDayForecast = function(daily){  
    for(let i =1; i < 6; i ++){
        let forecastDate = document.querySelector("#date-" + [i]);
        forecastDate.innerHTML = dayjs().add([i], 'day').format('M/DD/YYYY');
        let forecastImg = document.querySelector("#img-" + [i]);
        let forecastIcon = daily[i].weather[0].icon;
        forecastImg.setAttribute("src",`https://openweathermap.org/img/wn/${forecastIcon}@2x.png`);
        let forecastTemp = document.querySelector("#temp-" + [i]);
        forecastTemp.innerHTML = "Temp: " + daily[i].temp.day;
        let forecastWind = document.querySelector("#ws-" + [i]);
        forecastWind.innerHTML = "Wind: " + daily[i].wind_speed;
        let forecastHumidity = document. querySelector("#hum-" + [i]) ;
        forecastHumidity.innerHTML = "Humidity: " + daily[i].humidity;
    }
}


