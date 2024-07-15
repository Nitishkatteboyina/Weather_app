const url = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

$(document).ready(function () {
    weatherFn('Pune');
});

async function weatherFn(cName) {
    const temp = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.city.name);
    $('#weather-info').fadeIn();

    // Filter to get hourly data for the next 24 hours
    const hourlyWeather = data.list.filter(item => {
        const now = moment();
        const forecastTime = moment.unix(item.dt);
        // Check if forecast time is within the next 24 hours
        return forecastTime.isAfter(now) && forecastTime.isBefore(now.clone().add(1, 'day').endOf('day'));
    });

    // Filter to get data for every hour
    const hourlyWeatherFiltered = hourlyWeather.filter((item, index) => index % 1 === 0);

    const hourlyWeatherHTML = hourlyWeatherFiltered.map(item => {
        const dateTime = moment.unix(item.dt);
        const date = dateTime.format('MMMM Do YYYY');
        const time = dateTime.format('HH:mm');
        const temperature = item.main.temp;
        const description = item.weather[0].description;
        const windSpeed = item.wind.speed;
        const humidity = item.main.humidity;
        const iconUrl = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        return `
            <div class="hourly-forecast">
                <div class="datetime">
                    <div class="date">${date}</div>
                    <div class="time">${time}</div>
                </div>
                <img src="${iconUrl}" alt="Weather Icon">
                <div class="temp">${temperature}°C</div>
                <div class="description">${description}</div>
                <div class="wind-humidity">
                    <div>Wind: ${windSpeed} m/s</div>
                    <div>Humidity: ${humidity}%</div>
                </div>
            </div>
        `;
    }).join('');

    $('#hourly-weather').html(hourlyWeatherHTML);
}
