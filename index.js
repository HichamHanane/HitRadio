
const apiKey = "df44f85ddab485da6f7ffca1cee027ef";

let  chartTextColor;
let  chartGridColor;
let  chartLineColor;
let  chartBackgroundColor;

let currentWeatherIsLoading = true;
let myChart;
// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Function to set the theme
    const setTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';

            chartTextColor ="rgb(58, 65, 96)";
            chartGridColor="rgba(58, 65, 96, 0.2)";
            chartLineColor="rgb(58, 65, 96)";

        } else {
            body.classList.remove('light-mode');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            // chartTextColor ="white";
            // chartGridColor="white";
            // chartLineColor="white";
        }
        localStorage.setItem('theme', theme);
    };

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Default to dark mode if no preference is saved
        setTheme('dark');
    }

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    });
    new Splide('#custom-carousel', {
        type: 'loop',
        perPage: 3,
        gap: '8rem',
        breakpoints: {
            1024: {
                perPage: 2,
            },
            640: {
                perPage: 1,
            },
        },
    }).mount();
});

// logic code to get the current location
const getWeatherCurrentLocation = async () => {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLoactionAndWeather, (error) => {
            console.error("Error getting location:", error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

const showLoactionAndWeather = async (position) => {

    try {

        let Latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        let location = {
            Latitude,
            longitude
        }

        localStorage.setItem("current location", JSON.stringify(location))

        const ApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${Latitude}&lon=${longitude}&appid=${apiKey}&units=metric`

        const getWeatherData = await axios.get(ApiUrl);

        console.log('response :', getWeatherData.data);

        localStorage.setItem("current city", JSON.stringify(getWeatherData.data.name))

        // document.getElementById('forecast_current_city').innerHTML = `${JSON.parse(localStorage.getItem('current city'))}`

        currentWeatherIsLoading = false;
        let currentWeather = getWeatherData.data.weather[0]?.main;
        let iconCode = getWeatherData.data.weather[0]?.icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

        document.getElementById('card_container').innerHTML = `
            <h1 class="current_city" id="currentCity"><i class="fa-solid fa-location-dot" style="background-color: transparent;font-size:1.5rem;color:#3A4160"></i>  ${getWeatherData.data.name}, ${getWeatherData.data.sys.country}</h1>
            <img loading="lazy" src="${iconUrl}" alt="weather icon" srcset="" width="100px" height="100px" id="weather_icon">
            
            <h2 class="city_temp" id="currentTemp">${Math.round(getWeatherData.data.main.temp)}°C</h2>
            <p class="weather_condition" id="weatherCondition">${currentWeather}</p>

            <div class="bottom_card">
                <p id="currentWind" class="wind"><i class="fa-solid fa-wind" style="font-size:0.8rem;"></i> Wind : ${getWeatherData.data.wind.speed} km/h</p>
                <p id="currentHumidity" class="Humidity"><i class="fa-solid fa-droplet" style="font-size:0.8rem;"></i>  Humidity : ${getWeatherData.data.main.humidity} % </p>
            </div>
        `

    } catch (error) {
        console.log('Error : ', error);
    }
}


//logic code the city's weather that the user enter
const search_button = document.getElementById('button_search');

search_button.onclick = () => {
    let input_value = document.getElementById('city').value

    console.log('City :', input_value);

    getCityWeather(input_value);

}

const getCityWeather = async (city) => {
    try {

        let Apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        let getWeatheCity = await axios.get(`${Apiurl}`)

        let currentWeather = getWeatheCity.data.weather[0]?.main;
        let iconCode = getWeatheCity.data.weather[0]?.icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
        localStorage.setItem("current city", JSON.stringify(getWeatheCity.data.name))

        // document.getElementById('forecast_current_city').innerHTML = `${JSON.parse(localStorage.getItem('current city'))}`

        getThe5days();

        document.getElementById('card_container').innerHTML = `
            <h1 class="current_city" id="currentCity"><i class="fa-solid fa-location-dot" style="background-color: transparent;font-size:1.5rem;color:#3A4160"></i> ${getWeatheCity.data.name}, ${getWeatheCity.data.sys.country}</h1>
            <img loading="lazy" src="${iconUrl}" alt="weather icon" srcset="" width="100px" height="100px" id="weather_icon">
            
            <h2 class="city_temp" id="currentTemp">${Math.round(getWeatheCity.data.main.temp)}°C</h2>
            <p class="weather_condition" id="weatherCondition">${currentWeather}</p>

            <div class="bottom_card">
                <p id="currentWind" class="wind"><i class="fa-solid fa-wind" style="font-size:0.8rem;"></i> Wind : ${getWeatheCity.data.wind.speed} km/h</p>
                <p id="currentHumidity" class="Humidity"><i class="fa-solid fa-droplet" style="font-size:0.8rem;"></i> Humidity : ${getWeatheCity.data.main.humidity} % </p>
            </div>
        `

    }
    catch (error) {
        console.log('Error getting city weather :', error);
        alert(error.response.data.message)
    }
}

// logic code to get the forecast days 
const getThe5days = async () => {

    try {
        let location = JSON.parse(localStorage.getItem('current city'));
        console.log('Location', location);

        let ApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
        let get5Days = await axios.get(ApiUrl);

        console.log("5 days", get5Days.data.list);

        localStorage.setItem('list_of_5_forecast', JSON.stringify(get5Days.data.list));

        Forecast5Days(get5Days.data.list);

        document.getElementById('days_navLinks').innerHTML = ""


        let days = []
        get5Days.data.list.forEach(day => {
            let dateOnly = day.dt_txt.split(" ")[0];


            if (!days.includes(dateOnly)) {
                days.push(dateOnly)
            }
        });

        days.forEach(day => {
            document.getElementById('days_navLinks').innerHTML += `<p class="day" onclick="getForecast('${day}')">${new Date(day).toLocaleDateString("en-US", { weekday: "long" })}</p>`
        })

        getForecast(days[0])


        console.log('Days  :', days);
        console.log('Day 2 :', days[0]);


    } catch (error) {
        console.log('Error while getting the 5 days :', error);

    }
}


const Forecast5Days = (list) => {
    let days = {}
    list.forEach(day => {
        let date = day.dt_txt.split(" ")[0];

        if (!days[date]) {
            days[date] = [];
        }
        days[date].push(day);
    })

    console.log('----- Days ----- ', days);

    let dailyAverages = [];
    for (let date in days) {
        let dayData = days[date]
        let TempSum = 0;

        dayData.forEach(entry => {
            TempSum += entry.main.temp;
        });

        let avgTemp = TempSum / dayData.length;
        let mainWeather = dayData[0].weather[0].main;
        let windWeather = dayData[0].wind.speed;
        let humidityWeather = dayData[0].main.humidity;
        let iconCode = dayData[0].weather[0].icon;
        dailyAverages.push({
            date: date,
            avgTemp: avgTemp.toFixed(1),
            weather: mainWeather,
            wind: windWeather,
            humidity: humidityWeather,
            icon: iconCode
        });

    }

    console.log("Daily Averages : ", dailyAverages);
    let currentCity = JSON.parse(localStorage.getItem('current city'));

    document.getElementById('splide__list').innerHTML = "";
    dailyAverages.forEach(day => {
        document.getElementById('splide__list').innerHTML += `
            <li class="splide__slide">
                    <div class="card_weather_forecast">
                        <h1 class="current_city" id="currentCity" style="font-size:0.5rem">
                            <i class="fa-solid fa-location-dot"style="background-color: transparent;font-size:0.5rem;color:#3A4160"></i>
                            ${currentCity}
                        </h1>
                        <h6 class="forecast_5days_header">
                            <i class="fa-regular fa-calendar-days" style="font-size:1rem"></i>
                            ${new Date(day.date).toLocaleDateString("en-US", { weekday: "long" })}
                        </h6>
                        <h2 class="city_temp" id="currentTemp">${Math.round(day.avgTemp)}°C</h2>
                        <p class="weather_condition" id="weatherCondition">${day.weather}</p>
                        <div class="bottom_card">
                            <p id="currentWind" class="wind">Wind : ${day.wind} km/h</p>
                            <p id="currentHumidity" class="Humidity">Humidity : ${day.humidity} % </p>
                        </div>
                    </div>
                </li>
        
        `
    })

    new Splide('#custom-carousel', {
        type: 'loop',
        perPage: 4,
        gap: '8rem',
        breakpoints: {
            1024: {
                perPage: 2,
            },
            640: {
                perPage: 1,
            },
        },
    }).mount();

}


const renderChart = (forecastData) => {
    const labels = forecastData.map(item => {
        let time = item.dt_txt.split(" ")[1].substring(0, 5);
        return time;
    });

    const temperatures = forecastData.map(item => item.main.temp);

    // Check for light mode and set colors
    const isLightMode = document.body.classList.contains('light-mode');
    // const chartTextColor = isLightMode ? 'rgb(58, 65, 96)' : 'white';
    // const chartGridColor = isLightMode ? 'rgba(58, 65, 96, 0.2)' : 'rgba(255, 255, 255, 0.2)';
    // const chartLineColor = isLightMode ? 'rgb(58, 65, 96)' : 'rgb(58, 65, 96)';
    // const chartBackgroundColor = isLightMode ? 'rgba(58, 65, 96, 0.2)' : 'rgba(58, 65, 96, 0.5)';
    const data = {
        labels: labels,
        datasets: [{
            label: 'Temperature (°C)',
            backgroundColor: chartBackgroundColor,
            borderColor: chartLineColor,
            data: temperatures,
            fill: true,
            tension: 0.4
        }]

    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: chartGridColor
                    },
                    ticks: {
                        color: chartTextColor
                    }
                },
                x: {
                    grid: {
                        color: chartGridColor
                    },
                    ticks: {
                        color: chartTextColor
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: chartTextColor
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }

    };

    const ctx = document.getElementById('temperatureChart').getContext('2d');
    if (myChart) {
        myChart.destroy(); // Destroy the old chart if it exists
    }
    myChart = new Chart(ctx, config); // Create a new chart
};

// logic code to to change the active element style
const navlinksActiveElement = () => {
    const div_container = document.getElementById('days_navLinks')
    const childs = div_container.querySelectorAll('.day')

    childs.forEach((child) => {
        console.log("Child :", child);

        child.addEventListener("click", () => {
            childs.forEach(child_element => child_element.classList.remove('forcast_navlink_active'))

            child.classList.add('forcast_navlink_active');
        })



    })

}

// logic code to display the weather(3 hours forecast) of each 5-day 
const getForecast = (selectedDay) => {

    navlinksActiveElement();

    console.log('Daay :', selectedDay);

    let forecast_list = JSON.parse(localStorage.getItem('list_of_5_forecast'));
    let select_day_forcast = forecast_list.filter((day) => (day.dt_txt.split(" ")[0]) == selectedDay);

    console.log("Liist :", select_day_forcast);

    document.getElementById('forcast_container').innerHTML = "";
    // let currentCity = JSON.parse(localStorage.getItem('current city'))

    select_day_forcast.forEach((day) => {

        let iconCode = day.weather[0]?.icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
        let time = day.dt_txt.split(" ")[1];
        let formattedTime = time.split(":").slice(0, 2).join(":");

        document.getElementById('forcast_container').innerHTML += `
            <div class="forcaste_card">
                <div class="card_header">
                    
                    <p class="time">  ${formattedTime}</p>
                </div>
                <div class="card_temp">
                    <p>
                    ${Math.round(day.main.temp)}°C 
                    <img loading="lazy" src="${iconUrl}" alt="weather icon" srcset="" width="50px" height="50px" id="weather_icon">

                    
                    </p>
                </div>
                <div class="card_weather_condition">
                    <p>${day.weather[0].description}</p>
                </div>
                <div class="card_wind">
                    <p>Wind : ${day.wind.speed} km/h</p>
                </div>
            </div>
        `
    })
    renderChart(select_day_forcast)

}




getWeatherCurrentLocation();
getThe5days();


// document.getElementById('forecast_current_city').innerHTML = `${JSON.parse(localStorage.getItem('current city'))} `
// getCurrentLocation();

