// Event listener to run the code AFTER all the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Added the API key sent to me by OpenWeatherMap
    var apiKey = '3118255833524eba6b72b13dacb447e1';
    // Created variables with ID elements from the DOM
    var searchButton = document.getElementById('search-button');
    var cityInput = document.getElementById('city-input');
    var currentWeather = document.getElementById('current-weather');
    var forecast = document.getElementById('forecast');
    var cityList = document.getElementById('city-list');
    var clearStorage = document.getElementById('clear-history');

    // Fetch the current weather of any given city
    function fetchCurrentWeather(city) {
        var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

        // Fetched the data from the URL var and update the DOM with the new values
        fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => updateCurrentWeather(data));
    }

    // Fetch the 5-day forecast of any given city
    function fetchForecast(city) {
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

        // Fetched the data from the URL var and update the DOM with the new values
        fetch(forecastUrl)
        .then(response => response.json())
        .then(data => updateForecast(data));
    }

    // Updates the current weather div 
    function updateCurrentWeather(data) {
        // This line clears any past values from the div
        currentWeather.innerHTML = '';

        // Creates the HTML skeleton with the fetched data
        var weatherContent = `
        <div class="current-card">
            <h2 class="city-name"> ${data.name} (${new Date(data.dt * 1000).toLocaleDateString()}) </h2>
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon" >
            <p> Temp: ${data.main.temp.toFixed(1)}°F </p>
            <p> Wind: ${data.wind.speed.toFixed(1)} MPH </p>
            <p> Humidity: ${data.main.humidity} % </p>
        </div>`;

        // Add the HTML skeleton to the div
        currentWeather.innerHTML = weatherContent;
    }

    // Updates the forecast div 
    function updateForecast(data) {
        // This line clears any past values from the div
        forecast.innerHTML = '';

        // This loop lets us retrieve the weather for each day. The API updates the weather forecast every 3 hours, so every 8 intervals of 3 hours would be a new day
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

            // Add the HTML skeleton to the div
            forecast.innerHTML += forecastCard;
        }
    }

    // Funtion to add the city name to the localStorage and appends a button for reusability
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

            // Appends the button to the DOM
            cityList.appendChild(cityButton);
        }
    }

    // Funtion that enables loading the values of past cities searched
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

    // Event listener for the search city feature
    searchButton.addEventListener('click', () => {
        var city = cityInput.value.trim();

        // Logical condition for right and wrong entries
        if (city) {
            fetchCurrentWeather(city);
            fetchForecast(city);
            addCityToStorage(city);
        } else {
            console.error('Please enter a valid city name');
        }
    });

    // Added a button to clear the search history from the storage and the page
    clearStorage.addEventListener('click', function() {
        localStorage.removeItem('searchHistory');
        cityList.innerHTML = '';
    });

    // This loads any previous cities when the page is loaded
    loadSearchHistory();
});