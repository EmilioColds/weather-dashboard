document.addEventListener('DOMContentLoaded', () => {
    var apiKey = '3118255833524eba6b72b13dacb447e1';
    var searchButton = document.getElementById('search-button');
    var cityInput = document.getElementById('city-input');
    var currentWeather = document.getElementById('current-weather');
    var forecast = document.getElementById('forecast');
    var cityList = document.getElementById('city-list');
    var clearStorage = document.getElementById('clear-history');

    function fetchCurrentWeather(city) {
        var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

        fetch(currentWeatherUrl)
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
        <div class="current-card">
            <h2 class="city-name"> ${data.name} (${new Date(data.dt * 1000).toLocaleDateString()}) </h2>
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon" >
            <p> Temp: ${data.main.temp.toFixed(1)}°F </p>
            <p> Wind: ${data.wind.speed.toFixed(1)} MPH </p>
            <p> Humidity: ${data.main.humidity} % </p>
        </div>`;

        currentWeather.innerHTML = weatherContent;
    }

    function updateForecast(data) {
        forecast.innerHTML = '';

        for (let i = 0; i < data.list.length; i += 8) {
            var dayData = data.list[i];
            var forecastCard = `
            <div class="weather-card"> 
                <h3>${new Date(dayData.dt_txt).toLocaleDateString()}</h3>
                <img src="http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" alt="Weather Icon" >
                <p>Temp: ${dayData.main.temp.toFixed(1)}°F </p>
                <p>Wind: ${dayData.wind.speed.toFixed(1)} MPH </p>
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

    searchButton.addEventListener('click', () => {
        var city = cityInput.value.trim();
        if (city) {
            fetchCurrentWeather(city);
            fetchForecast(city);
            addCityToStorage(city);
        } else {
            console.error('Please enter a valid city name');
        }
    });

    clearStorage.addEventListener('click', function() {
        localStorage.removeItem('searchHistory');
        cityList.innerHTML = '';
    });

    loadSearchHistory();
});