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
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
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
      if (dataObj.shortForecast.toLowerCase().includes("chance light rain"))
        return "fa-cloud-sun-rain"
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
    return "fa-rainbow"
  }

  getWeatherData()
  getWeatherForecast()

  function getBgImg(date) {
    // If Victor's not home
    if (
      date.getHours() > 7 &&
      date.getHours() < 17 &&
      date.getDay() !== 0 &&
      date.getDay() !== 6
    ) {
      if (dataObj.isDaytime) return "summer-day-mostlycloudy"
    }

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

  var testing = true

  setInterval(function() {
    const date = new Date()

    if (testing) {
      console.log(dataObj)
      console.log(date.getHours())
      console.log
    }
    testing = false

    dayOfWeek.innerText = dayNames[date.getDay()]
    todaysDate.innerText = `${monthNames[date.getMonth()]} ${date.getDate()}`
    time.innerText = date.toLocaleTimeString().match(/[0-9]+[:][0-9]+/g)
    currentTemp.innerText = `${dataObj.currentTemp}°`

    var forecastTempString = ""

    if (date.getHours() >= 16 && date.getHours() < 23) {
      forecastTempString = `Tonight's low will be ${dataObj.tonightLow}°.`
    }

    detailedForecast.innerText = `${dataObj.detailedForecast} ${forecastTempString}`

    $(weatherIcon).addClass(getCurrentIcon())

    // Background images

    document.body.style.backgroundImage = `url("img/bg/${getBgImg(date)}.jpg")`
  }, 2000)
}) // end jQuery
