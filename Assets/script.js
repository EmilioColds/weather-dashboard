document.addEventListener('DOMContentLoaded', () => {
    var apiKey = '3118255833524eba6b72b13dacb447e1';
    var searchButton = document.getElementById('search-button');
    var cityInput = document.getElementById('city-input');
    var currentWeather = document.getElementById('current-weather');
    var forecast = document.getElementById('forecast');
    var cityList = document.getElementById('city-list');

    function fetchCurrentWeather(city) {
        var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

        fetch(currentWeatherUril)
        .then(response => response.json())
        .then(data => updateCurrentWeather(data));
    }

    function fetchForecast(city) {
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

        fetch(forecastUrl)
        .then(response => response.json())
        .then(data => updateForecast(data));
    }

    function updateCurrentWeather(data) {
        currentWeather.innerHTML = '';

        var weatherContent = `
        <div class=weather-card>
            <h2> ${data.name} (${new Date().toLocaleDateString()}) </h2>
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon >
            <p> Temp: ${data.main.temp}°F </p>
            <p> Wind: ${data.wind.speed} MPH </p>
            <p> Humidity: ${data.main.humidity} % </p>
        </div>`;

        currentWeather.innerHTML = weatherContent;
    }

    function updateForecast(data) {
        forecast.innerHTML = '';

        for (let i = 0; i < data.list.length; i += 8) {
            var dayData = data.list[i];
            var forecastCard = `
            <div class="weather-card> 
                <h3>${new Date(dayData.dt_txt).toLocaleDateString()}</h3>
                <img src="http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" alt="Weather Icon" >
                <p>Temp: ${dayData.main.temp}°F </p>
                <p>Wind: ${dayData.wind.speed} MPH </p>
                <p>Humidity: ${dayData.main.humidity} % </p>
            </div>`;

            forecast.innerHTML += forecastCard;
        }
    }

    function addCityToStorage(city) {
        var storage = JSON.parse(localStorage.getItem('searchHistory')) || [];

        if (!storage.includes(city)) {
            storage.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(storage));

            var cityButton = document.createElement('button');
            cityButton.textContent = city;
            cityButton.classList.add('city-button');
            cityButton.addEventListener('click', () => {
                fetchCurrentWeather(city);
                fetchForecast(city);
            });

            cityList.appendChild(cityButton);
        }
    }

    function loadSearchHistory () {
        var storage = JSON.parse(localStorage.getItem('searchHistory')) || [];

        storage.forEach(city => {
            var cityButton = document.createElement('button');
            cityButton.textContent = city;
            cityButton.classList.add('city-button');
            cityButton.addEventListener('click', () => {
                fetchCurrentWeather(city);
                fetchForecast(city);
            });

            cityList.appendChild(cityButton);
        });
    }
});