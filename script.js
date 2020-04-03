$(document).ready(function () {
  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ]
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dayOfWeek = document.getElementById("dayOfWeek")
  const todaysDate = document.getElementById("todaysDate")
  const time = document.getElementById("time")
  const currentTemp = document.getElementById("currentTemp")
  const weatherIcon = document.getElementById("weatherIcon")
  const bigForecast = document.getElementById("bigForecast")
  const medForecast = document.getElementById("medForecast")
  const smallForecast = document.getElementById("smallForecast")
  const solarStats = document.getElementById("solarStats")

  var dataObj = {
    astronomical: {
      moon: {
        age: "",
        moonrise: "",
        moonset: "",
        phase: "",
      },
      astronomical_twilight_begin: "",
      astronomical_twilight_end: "",
      civil_twilight_begin: "",
      civil_twilight_end: "",
      day_length: "",
      nautical_twilight_begin: "",
      nautical_twilight_end: "",
      solar_noon: "",
      sunrise: "",
      sunset: "",
    },
    aqi: 28,
    chancePrecipitation: 10,
    chanceThunder: 0,
    currentConditions: "Chance Rain Showers",
    currentTemp: 43,
    dayLength: "",
    detailedForecast: "Partly cloudy. Normal conditions expected. Enjoy the day.",
    bestDayToGetOutside: "",
    humitidy: 66,
    isDaytime: true,
    pressure: 30.09,
    pressureDirection: "falling",
    shortForecast: "Chance Rain Showers",
    snow: {
      chanceSnow: 0,
      snowAccumInchesMax: 0,
      snowAccumInchesMin: 0,
    },
    todayHigh: 46,
    todayLow: 36,
    tomorrowHigh: 48,
    tomorrowLow: 38,
    uvIndex: 1,
    windDirection: "",
    windSpeed: "",
    visibilityMiles: 10,
  }
  var loadPageOneTime = true
  var date = new Date()

  getCurrentWeather()
  getWeatherForecast()
  getSolarData()

  setInterval(function () {
    date = new Date()

    if (loadPageOneTime) {
      console.log(dataObj)
      // console.log(date.getHours())
      populateDetailedForecast(dataObj)
      loadPageOneTime = false
    }

    // Date
    dayOfWeek.innerText = dayNames[date.getDay()]
    todaysDate.innerText = `${monthNames[date.getMonth()]} ${date.getDate()}`
    time.innerText = date.toLocaleTimeString().match(/[0-9]+[:][0-9]+/g)

    // Weather
    if (dataObj.currentTemp) {
      currentTemp.innerText = `${dataObj.currentTemp + 1}°`
    }
    $(weatherIcon).addClass(getWeatherIcon())

    // Solar
    $(solarStats).text(getSolarStats())

    // Background images
    document.body.style.backgroundImage = `url("img/bg/${getBgImg(date)}.jpg")`
  }, 2000)

  function getWeatherForecast() {
    $.ajax({
      url: "https://api.weather.gov/gridpoints/SEW/125,67/forecast",

      dataType: "json",
      success: function (data) {
        console.log("!", data)
        dataObj.shortForecast = data.properties.periods[0].shortForecast
        dataObj.detailedForecast = data.properties.periods[0].detailedForecast
        populateDetailedForecast(dataObj)
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        if (date.getHours() > 7 && date.getHours() < 22) {
          // Schedule the next request every 30 minutes
          console.log("weather updating every 30 minutes")
          setTimeout(getWeatherForecast, 1800000)
        } else {
          console.log("weather updating every 3 hours")
          // Schedule the next request every 3 hours
          setTimeout(getWeatherForecast, 10800000)
        }
      },
    })
  }

  function getCurrentWeather() {
    $.ajax({
      url: "https://api.weather.gov/gridpoints/SEW/125,67/forecast/hourly",
      dataType: "json",
      success: function (data) {
        dataObj.isDaytime = data.properties.periods[0].isDaytime
        dataObj.currentTemp = data.properties.periods[0].temperature
        dataObj.windSpeed = data.properties.periods[0].windSpeed
        dataObj.windDirection = data.properties.periods[0].windDirection
        dataObj.currentConditions = data.properties.periods[0].shortForecast
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        // Schedule the next request when the current one's complete
        if (date.getHours() > 7 && date.getHours() < 22) {
          // Schedule the next request every 30 minutes
          console.log("weather updating every 30 minutes")
          setTimeout(getCurrentWeather, 1800000)
        } else {
          console.log("weather updating every 3 hours")
          // Schedule the next request every 3 hours
          setTimeout(getCurrentWeather, 10800000)
        }
      },
    })
  }

  function getBgImg(date) {
    // If Victor's not home
    if (date.getHours() > 7 && date.getHours() < 17 && date.getDay() !== 0 && date.getDay() !== 6) {
      if (dataObj.isDaytime) return "summer-mostlyclear-day"
    }
    // Victor's mom's pics
    {
      if (date.getMinutes() >= 0 && date.getMinutes() < 2) return "img-1"
      if (date.getMinutes() >= 2 && date.getMinutes() < 4) return "img-2"
      if (date.getMinutes() >= 4 && date.getMinutes() < 6) return "img-3"
      if (date.getMinutes() >= 6 && date.getMinutes() < 8) return "img-4"
      if (date.getMinutes() >= 8 && date.getMinutes() < 10) return "img-5"
      if (date.getMinutes() >= 10 && date.getMinutes() < 12) return "img-6"
      if (date.getMinutes() >= 12 && date.getMinutes() < 14) return "img-1"
      if (date.getMinutes() >= 14 && date.getMinutes() < 16) return "img-2"
      if (date.getMinutes() >= 16 && date.getMinutes() < 18) return "img-3"
      if (date.getMinutes() >= 18 && date.getMinutes() < 20) return "img-4"
      if (date.getMinutes() >= 20 && date.getMinutes() < 22) return "img-5"
      if (date.getMinutes() >= 22 && date.getMinutes() < 24) return "img-6"
      if (date.getMinutes() >= 24 && date.getMinutes() < 26) return "img-1"
      if (date.getMinutes() >= 26 && date.getMinutes() < 28) return "img-2"
      if (date.getMinutes() >= 28 && date.getMinutes() < 30) return "img-3"
      if (date.getMinutes() >= 30 && date.getMinutes() < 32) return "img-4"
      if (date.getMinutes() >= 32 && date.getMinutes() < 34) return "img-5"
      if (date.getMinutes() >= 34 && date.getMinutes() < 36) return "img-6"
      if (date.getMinutes() >= 36 && date.getMinutes() < 38) return "img-1"
      if (date.getMinutes() >= 38 && date.getMinutes() < 40) return "img-2"
      if (date.getMinutes() >= 40 && date.getMinutes() < 42) return "img-3"
      if (date.getMinutes() >= 42 && date.getMinutes() < 44) return "img-4"
      if (date.getMinutes() >= 44 && date.getMinutes() < 46) return "img-5"
      if (date.getMinutes() >= 46 && date.getMinutes() < 48) return "img-6"
      if (date.getMinutes() >= 48 && date.getMinutes() < 50) return "img-1"
      if (date.getMinutes() >= 50 && date.getMinutes() < 52) return "img-2"
      if (date.getMinutes() >= 52 && date.getMinutes() < 54) return "img-3"
      if (date.getMinutes() >= 54 && date.getMinutes() < 56) return "img-4"
      if (date.getMinutes() >= 56 && date.getMinutes() < 58) return "img-5"
      if (date.getMinutes() >= 58 && date.getMinutes() < 61) return "img-6"
    }
  }

  function getSolarData() {
    $.ajax({
      url: "https://api.sunrise-sunset.org/json?lat=47.6&lng=-122.3",
      dataType: "json",
      success: function (data) {
        var d = new Date()
        for (var key in data.results) {
          var myDate = new Date(
            `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${data.results[key]} UTC`
          )
          dataObj.astronomical[key] = myDate.toTimeString().match(/[0-9]+[:][0-9]+/g)[0]
        }
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        if (date.getHours() > 6 && date.getHours() < 22) {
          // Schedule the next request every 30 minutes
          console.log("solar data updating every 30 minutes")
          setTimeout(getSolarData, 1800000)
        } else {
          console.log("solar data updating every 3 hours")
          // Schedule the next request every 3 hours
          setTimeout(getSolarData, 10800000)
        }
      },
    })
  }

  function getSolarStats() {
    var sr = dataObj.astronomical.sunrise
    var ss = dataObj.astronomical.sunset

    if (sr[0] === "0") sr = sr.substr(1)
    // Note: This may break if sunset is after midnight
    ss = ss.substr(1)
    var num = ss[0]
    num = num - 2
    ss = num + ss.substr(1)

    return `Sunrise: ${sr}am Sunset: ${ss}pm`
  }

  function getWeatherIcon() {
    // day or night
    if (dataObj.shortForecast === "") return ""
    if (dataObj.shortForecast.toLowerCase().includes("snow")) return "fa-snowflake"
    if (dataObj.shortForecast.toLowerCase().includes("thunder")) return "fa-bolt"
    if (dataObj.shortForecast.toLowerCase().includes("smoke")) return "fa-smog"
    if (dataObj.shortForecast.toLowerCase().includes("snow")) return "fa-snowflake"

    // daytime
    if (dataObj.isDaytime) {
      if (dataObj.shortForecast.toLowerCase() === "chance rain showers") return "fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "mostly sunny") return "fa-sun"
      if (dataObj.shortForecast.toLowerCase().includes("light rain")) return "fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase().includes("showers")) return "fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase().includes("rain")) return "fa-cloud-showers-heavy"
      if (dataObj.shortForecast.toLowerCase().includes("clear")) return "fa-sun"
      return "fa-cloud-sun"
    }
    // nighttime
    if (!dataObj.isDaytime) {
      if (dataObj.shortForecast.toLowerCase().includes("light rain")) return "fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase().includes("showers")) return "fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase().includes("heavy rain"))
        return "fa-cloud-showers-heavy"
      if (dataObj.shortForecast.toLowerCase().includes("clear")) return "fa-moon"
      return "fa-cloud-moon"
    }
    return "fa-rainbow"
  }

  function populateDetailedForecast(dataObj) {
    smallForecast.innerText = ""
    var splitForecast = dataObj.detailedForecast.split(".")
    splitForecast.pop()

    for (var i = 0; i < splitForecast.length; i++) {
      if (i === 0) {
        bigForecast.innerText = `${splitForecast[i]}.`
      } else if (i === 1) {
        medForecast.innerText = `${splitForecast[i]}.`
      } else {
        smallForecast.innerText += `${splitForecast[i]}.`
      }
    }
  }
}) // end jQuery
