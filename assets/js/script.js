const cityInputEl = document.querySelector("#city")
const cityFormEl = document.querySelector("#city-search")
const searchBtnEl = document.querySelector(".btn")
const savedSearch = document.querySelector("#saved-search")
const weatherData = document.querySelector("#current-weather")
const fiveForecastEl = document.querySelector("#five-day-forecast")
const fivedayText = document.querySelector("#five-day-text")
const fiveDayContainer = document.querySelector("#five-day")
let savedCities =[]

//Current City 
const weatherImage = document.querySelector("#weather-img")
const date = document.querySelector("#current-date")
const temp = document.querySelector("#city-temp")
const wind = document.querySelector("#city-ws")
const humidity = document.querySelector("#city-humidity")
const uv = document.querySelector("#city-uv")

let currentDate = dayjs().format('M/DD/YYYY')

//Root API and KEY
const rootUrl = 'https://api.openweathermap.org';
const apiKey ='ffb1997b031804bb94db3209b18b6613'

let limit = 5;
let lat;
let lon;


window.onload = function(event) {
    buttonLoad();
   
}

//Get User Input and Send to get City Function 
cityFormEl.addEventListener("submit", function(event){
    event.preventDefault();
    let userCityName= event.target[0].value;
    weatherData.style.display = "block";
    fiveDayContainer.style.display = "block";
    getCity(userCityName);
    
})

var getCity = function(cityName){
    let cityUrl=`${rootUrl}/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`
    fetch(cityUrl).then(function(response){
        return response.json().then(function(data){
        lat = data[0].lat;
        lon = data[0].lon;
        getWeather(lat, lon, cityName); 
        createSaved(cityName)
        })
})
}
//Get Current Weather 
var getWeather = function(lat, lon, cityName){
    let forecastUrl = `${rootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    fetch(forecastUrl).then(function(response){
        return response.json().then(function(data){
            temp.innerHTML = "Temp: " + data.current.temp.toFixed(2) + "??F"
            wind.innerHTML = "Wind: " + data.current.wind_speed.toFixed(2) + " MPH"
            humidity.innerHTML = "Humidity: " + data.current.humidity + "%"
            uv.innerHTML =  data.current.uvi
            let currentDate = dayjs().format('M/DD/YYYY')
            const city = document.querySelector("#city-name")
            city.innerHTML =  cityName + " " + "(" + " " + currentDate + " " + ")"
            weatherImage.setAttribute("src",`http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`);
            fivedayText.innerHTML = "5 Day Forecast: "

            //Display UV badge
            if (uv.innerHTML >= 6) {
                uv.className =  "badge badge-danger"
            }else if(uv.innerHTML >3) {
                uv.className = "badge badge-warning"
            }
            else{
                uv.className = "badge badge-success"
            }
                //Call 5 day forecast func 
                fiveDayForecast(data.daily)
                })
            })    
        }


//Get 5 day forecast
var fiveDayForecast = function(daily){  
    for(let i =1; i < 6; i ++){
        let forecastDate = document.querySelector("#date-" + [i]);
        forecastDate.innerHTML = dayjs().add([i], 'day').format('M/DD/YYYY');
        let forecastImg = document.querySelector("#img-" + [i]);
        let forecastIcon = daily[i].weather[0].icon;
        forecastImg.setAttribute("src",`https://openweathermap.org/img/wn/${forecastIcon}@2x.png`);
        let forecastTemp = document.querySelector("#temp-" + [i]);
        forecastTemp.innerHTML = "Temp: " + daily[i].temp.day.toFixed(2) + "??F";
        let forecastWind = document.querySelector("#ws-" + [i]);
        forecastWind.innerHTML = "Wind: " + daily[i].wind_speed.toFixed(2) + " MPH";
        let forecastHumidity = document. querySelector("#hum-" + [i]) ;
        forecastHumidity.innerHTML = "Humidity: " + daily[i].humidity + "%";
    }
}

//Load buttons on page load
var buttonLoad = function() {
    loadCities =localStorage.getItem("cities")
    parsedCities = JSON.parse(loadCities)
    for (let i =0; i < parsedCities.length; i++){
        createSaved(parsedCities[i]) 
    }
}

var createSaved = function(saveCity){
    let saveBtn = document.createElement("button");
    saveBtn.textContent = saveCity;
    saveBtn.setAttribute("type", "submit");
    saveBtn.setAttribute("value", saveCity)
    saveBtn.className = "btn btn-secondary btn-lg btn-block";
    
    saveBtn.addEventListener("click", function(){
        getCity(saveCity)
    })
    if (!savedCities.includes(saveCity)) {
        savedCities.push(saveCity);
        savedSearch.appendChild(saveBtn)
      }
    //Set local storage 
    localStorage.setItem("cities" , JSON.stringify(savedCities))
}

//Add event listeners on clicked generated buttons 
savedSearch.addEventListener('click', function() {
    weatherData.style.display = "block";
    fiveDayContainer.style.display = "block";
}, false);