$(document).ready(function() {
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
    "Dec"
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dayOfWeek = document.getElementById("dayOfWeek")
  const todaysDate = document.getElementById("todaysDate")
  const time = document.getElementById("time")
  const currentTemp = document.getElementById("currentTemp")
  const weatherIcon = document.getElementById("weatherIcon")
  const detailedForecast = document.getElementById("detailedForecast")

  var dataObj = {}

  function getWeatherData() {
    $.ajax({
      url: "https://api.weather.gov/gridpoints/SEW/121,67/forecast/hourly",
      dataType: "json",
      success: function(data) {
        dataObj.isDaytime = data.properties.periods[0].isDaytime
        dataObj.currentTemp = data.properties.periods[0].temperature
        dataObj.windSpeed = data.properties.periods[0].windSpeed
        dataObj.windDirection = data.properties.periods[0].windDirection
        dataObj.currentConditions = data.properties.periods[0].shortForecast
      },
      error: function(data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function() {
        // Schedule the next request when the current one's complete
        setTimeout(getWeatherData, 2000000)
      }
    })
  }

  function getWeatherForecast() {
    $.ajax({
      url: "https://api.weather.gov/gridpoints/SEW/121,67/forecast",
      dataType: "json",
      success: function(data) {
        dataObj.shortForecast = data.properties.periods[0].shortForecast
        dataObj.detailedForecast = data.properties.periods[0].detailedForecast
        if (data.properties.periods[0].isDaytime === true) {
          dataObj.todayHigh = data.properties.periods[0].temperature
        }
        if (data.properties.periods[0].isDaytime === false) {
          dataObj.tonightLow = data.properties.periods[0].temperature
        }
        if (data.properties.periods[1].isDaytime === true) {
          dataObj.tomorrowHigh = data.properties.periods[1].temperature
        }
        if (data.properties.periods[1].isDaytime === false) {
          dataObj.tomorrowLow = data.properties.periods[1].temperature
        }
      },
      error: function(data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function() {
        // Schedule the next request when the current one's complete
        setTimeout(getWeatherForecast, 600000)
      }
    })
  }

  function getCurrentIcon() {
    // day or night
    if (dataObj.shortForecast.toLowerCase().includes("snow"))
      return "fa-snowflake"
    if (dataObj.shortForecast.toLowerCase().includes("thunder"))
      return "fa-bolt"
    if (dataObj.shortForecast.toLowerCase().includes("smoke")) return "fa-smog"
    if (dataObj.shortForecast.toLowerCase().includes("snow"))
      return "fa-snowflake"

    // daytime
    if (dataObj.isDaytime) {
      if (dataObj.shortForecast.toLowerCase().includes("light rain"))
        return "fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase().includes("showers"))
        return "fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase().includes("rain"))
        return "fa-cloud-showers-heavy"
      if (dataObj.shortForecast.toLowerCase().includes("clear")) return "fa-sun"
      return "fa-cloud-sun"
    }
    // nighttime
    if (!dataObj.isDaytime) {
      if (dataObj.shortForecast.toLowerCase().includes("light rain"))
        return "fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase().includes("showers"))
        return "fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase().includes("heavy rain"))
        return "fa-cloud-showers-heavy"
      if (dataObj.shortForecast.toLowerCase().includes("clear"))
        return "fa-moon"
      return "fa-cloud-moon"
    }
  }

  getWeatherData()
  getWeatherForecast()

  // var testing = true

  setInterval(function() {
    // if (testing) console.log(dataObj)
    // testing = false
    const date = new Date()
    dayOfWeek.innerText = dayNames[date.getDay()]
    todaysDate.innerText = `${monthNames[date.getMonth()]} ${date.getDate()}`
    time.innerText = date.toLocaleTimeString().match(/[0-9]+[:][0-9]+/g)
    currentTemp.innerText = `${dataObj.currentTemp}°`

    var forecastTempString = ""

    if (dataObj.isDaytime) {
      forecastTempString = `Tonight's low is ${dataObj.tonightLow}°`
    }
    if (!dataObj.isDaytime) {
      forecastTempString = `Tomorrow's high is ${dataObj.tomorrowHigh}°`
    }

    detailedForecast.innerText = `${dataObj.detailedForecast} ${forecastTempString}.`

    $(weatherIcon).addClass(getCurrentIcon())

    // Background images
    var img = "img-1"
    if (date.getMinutes() >= 0 && date.getMinutes() < 2) img = "img-1"
    if (date.getMinutes() >= 2 && date.getMinutes() < 4) img = "img-2"
    if (date.getMinutes() >= 4 && date.getMinutes() < 6) img = "img-3"
    if (date.getMinutes() >= 6 && date.getMinutes() < 8) img = "img-4"
    if (date.getMinutes() >= 8 && date.getMinutes() < 10) img = "img-5"
    if (date.getMinutes() >= 10 && date.getMinutes() < 12) img = "img-6"
    if (date.getMinutes() >= 12 && date.getMinutes() < 14) img = "img-1"
    if (date.getMinutes() >= 14 && date.getMinutes() < 16) img = "img-2"
    if (date.getMinutes() >= 16 && date.getMinutes() < 18) img = "img-3"
    if (date.getMinutes() >= 18 && date.getMinutes() < 20) img = "img-4"
    if (date.getMinutes() >= 20 && date.getMinutes() < 22) img = "img-5"
    if (date.getMinutes() >= 22 && date.getMinutes() < 24) img = "img-6"
    if (date.getMinutes() >= 24 && date.getMinutes() < 26) img = "img-1"
    if (date.getMinutes() >= 26 && date.getMinutes() < 28) img = "img-2"
    if (date.getMinutes() >= 28 && date.getMinutes() < 30) img = "img-3"
    if (date.getMinutes() >= 30 && date.getMinutes() < 32) img = "img-4"
    if (date.getMinutes() >= 32 && date.getMinutes() < 34) img = "img-5"
    if (date.getMinutes() >= 34 && date.getMinutes() < 36) img = "img-6"
    if (date.getMinutes() >= 36 && date.getMinutes() < 38) img = "img-1"
    if (date.getMinutes() >= 38 && date.getMinutes() < 40) img = "img-2"
    if (date.getMinutes() >= 40 && date.getMinutes() < 42) img = "img-3"
    if (date.getMinutes() >= 42 && date.getMinutes() < 44) img = "img-4"
    if (date.getMinutes() >= 44 && date.getMinutes() < 46) img = "img-5"
    if (date.getMinutes() >= 46 && date.getMinutes() < 48) img = "img-6"
    if (date.getMinutes() >= 48 && date.getMinutes() < 50) img = "img-1"
    if (date.getMinutes() >= 50 && date.getMinutes() < 52) img = "img-2"
    if (date.getMinutes() >= 52 && date.getMinutes() < 54) img = "img-3"
    if (date.getMinutes() >= 54 && date.getMinutes() < 56) img = "img-4"
    if (date.getMinutes() >= 56 && date.getMinutes() < 58) img = "img-5"
    if (date.getMinutes() >= 58 && date.getMinutes() < 61) img = "img-6"

    document.body.style.backgroundImage = `url("img/${img}.jpg")`
  }, 500)
}) // end jQuery
