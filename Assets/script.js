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
});