/*
General notes:
getDateInfo() is called first to get accurate date and time info
getSolarData() is then called to get sunrise and sunset info
getCurrentWeather() and getWeatherForecast() are then called after the above functions

getTodaysDate() recursively updates every second or few seconds
getSolarData(), getCurrentWeather() and getWeatherForecast() should update every 30 mintues or 
during certain events such as sunrise, sunset, at midnight, etc.

*/

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
  const lowTemp = document.getElementById("lowTemp")
  const tempRangeBar = document.getElementById("tempRangeBar")
  const tempRangeContainer = document.getElementById("tempRangeContainer")
  const highTemp = document.getElementById("highTemp")
  const weatherIcon = document.getElementById("weatherIcon")
  const bigForecast = document.getElementById("bigForecast")
  const medForecast = document.getElementById("medForecast")
  const smallForecast = document.getElementById("smallForecast")
  const solarStats = document.getElementById("solarStats")
  const shortForecastDisplay = document.getElementById("shortForecastDisplay")
  var date = new Date()
  var timeString = date.toTimeString().substring(0, 5)

  var dataObj = {
    aqi: null,
    astronomical: {
      astronomical_twilight_begin: "",
      astronomical_twilight_end: "",
      civil_twilight_begin: "",
      civil_twilight_end: "",
      day_length: "",
      moon: { age: "", moonrise: "", moonset: "", phase: "" },
      nautical_twilight_begin: "",
      nautical_twilight_end: "",
      solar_noon: "",
      sunrise: "",
      sunset: "",
    },
    bestDayToGetOutside: "",
    chanceHail: null,
    chancePrecipitation: null,
    chanceRain: null,
    chanceThunder: null,
    currentConditions: "",
    currentTemp: null,
    date: {
      currentTime: "",
      currentTimePeriod: "",
      dayOfWeek: "",
      displayTime: "",
      isDaytime: true,
      month: "",
      season: "",
      todaysDate: "",
      year: "",
    },
    detailedForecast: "",
    humitidy: null,
    pollen: {
      grass: null,
      overall: null,
      tree: null,
      ragweed: null,
    },
    pressure: null,
    pressureDirection: "",
    season: "",
    shortForecast: "",
    snow: { chanceSnow: null, snowAccumInchesMax: null, snowAccumInchesMin: null },
    todayHigh: null,
    todayLow: null,
    tomorrowHigh: null,
    tomorrowLow: null,
    uvIndex: null,
    visibilityMiles: null,
    windDirection: "",
    windSpeed: "",
  }

  ///////// For testing /////////
  dataObj = {
    aqi: null,
    astronomical: {
      astronomical_twilight_begin: "04:42",
      astronomical_twilight_end: "21:39",
      civil_twilight_begin: "06:01",
      civil_twilight_end: "20:20",
      day_length: "06:15",
      moon: {
        age: "",
        moonrise: "",
        moonset: "",
        phase: "",
      },
      nautical_twilight_begin: "05:23",
      nautical_twilight_end: "20:58",
      solar_noon: "13:10",
      sunrise: "06:32",
      sunset: "19:48",
    },
    bestDayToGetOutside: "",
    chanceHail: null,
    chancePrecipitation: null,
    chanceRain: null,
    chanceThunder: null,
    currentConditions: "Mostly Sunny",
    currentTemp: 51,
    date: {
      currentTime: "13:27",
      currentTimePeriod: "day",
      dayOfWeek: "Tuesday",
      displayTime: "1:27",
      isDaytime: "true",
      month: "April",
      season: "Spring",
      todaysDate: 7,
      year: 2020,
    },
    detailedForecast: "Mostly sunny, with a high near 56. Northwest wind 1 to 5 mph.",
    humitidy: null,
    pollen: {
      grass: null,
      overall: null,
      tree: null,
      ragweed: null,
    },
    pressure: null,
    pressureDirection: "",
    season: "",
    shortForecast: "Mostly Sunny",
    snow: {
      chanceSnow: null,
      snowAccumInchesMax: null,
      snowAccumInchesMin: null,
    },
    todayHigh: 56,
    todayLow: 39,
    tomorrowHigh: 60,
    tomorrowLow: 42,
    uvIndex: null,
    visibilityMiles: null,
    windDirection: "WSW",
    windSpeed: "1 mph",
  }
  renderInfoToScreen()

  setTimeout(() => {
    console.log(dataObj)
  }, 3000)
  ///////////////////////////////

  getDateInfo()
  // getSolarData()

  function getDateInfo() {
    date = new Date()
    timeString = date.toTimeString().substring(0, 5)

    // Populate dataObj with date & time data
    dataObj.date.currentTime = timeString
    dataObj.date.displayTime = date.toLocaleTimeString().match(/[0-9]+[:][0-9]+/g)[0]
    dataObj.date.dayOfWeek = dayNames[date.getDay()]
    dataObj.date.month = monthNames[date.getMonth()]
    dataObj.date.todaysDate = date.getDate()
    dataObj.date.season = getSeason()
    dataObj.date.year = date.getFullYear()

    // Check for certain events

    if (dataObj.date.currentTime === dataObj.astronomical.sunrise && date.getSeconds() === 2) {
      console.log("SUNRISE!")
      getCurrentWeather()
      getWeatherForecast()
      getSolarData()
    }
    if (dataObj.date.currentTime === dataObj.astronomical.sunset && date.getSeconds() === 2) {
      console.log("SUNSET!")
      getCurrentWeather()
      getWeatherForecast()
      getSolarData()
    }
    if (dataObj.date.currentTime === "00:00" && date.getSeconds() === 2) {
      console.log("MIDNIGHT!")
      getCurrentWeather()
      getWeatherForecast()
      getSolarData()
    }

    setTimeout(function () {
      getDateInfo()
    }, 5000)
  }

  function getSeason() {
    var time = Date.now()
    // 2020
    if (time < 1592636400000) return "Spring"
    if (time < 1600758000000) return "Summer"
    if (time < 1608537600000) return "Fall"
    if (time < 1616223600000) return "Winter"
    // 2021
    if (time < 1624172400000) return "Spring"
    if (time < 1632294000000) return "Summer"
    if (time < 1640073600000) return "Fall"
    if (time < 1647759600000) return "Winter"
    // 2022
    if (time < 1655794800000) return "Spring"
    if (time < 1663830000000) return "Summer"
    if (time < 1671609600000) return "Fall"
    if (time < 1679295600000) return "Winter"
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
        if (
          dataObj.date.currentTime > dataObj.astronomical.sunrise &&
          dataObj.date.currentTime < dataObj.astronomical.sunset
        ) {
          dataObj.date.isDaytime = "true"
        } else {
          dataObj.date.isDaytime = "false"
        }
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        dataObj.date.currentTimePeriod = getCurrentTimePeriod()
        getCurrentWeather()
        getWeatherForecast()
      },
    })
  }

  function getCurrentTimePeriod() {
    // console.log(dataObj.date.currentTime < dataObj.astronomical.astronomical_twilight_begin)
    // console.log(dataObj.date.currentTime < dataObj.astronomical.nautical_twilight_begin)
    // console.log(dataObj.date.currentTime < dataObj.astronomical.civil_twilight_begin)
    // console.log(dataObj.date.currentTime < dataObj.astronomical.sunrise)
    // console.log(dataObj.date.currentTime < "10:30")
    // console.log(dataObj.date.currentTime < "16:00")
    // console.log(dataObj.date.currentTime < dataObj.astronomical.sunset)
    // console.log(dataObj.date.currentTime < dataObj.astronomical.civil_twilight_end)
    // console.log(dataObj.date.currentTime < dataObj.astronomical.nautical_twilight_end)
    // console.log(dataObj.date.currentTime < dataObj.astronomical.astronomical_twilight_end)
    // console.log(dataObj.date.currentTime > dataObj.astronomical.astronomical_twilight_begin)

    if (dataObj.date.currentTime < dataObj.astronomical.astronomical_twilight_begin) return "znight"
    if (dataObj.date.currentTime < dataObj.astronomical.nautical_twilight_begin) return "znight"
    if (dataObj.date.currentTime < dataObj.astronomical.civil_twilight_begin)
      return "_beforesunrise"
    if (dataObj.date.currentTime < dataObj.astronomical.sunrise) return "_sunrise"
    if (dataObj.date.currentTime < "10:30") return "am"
    if (dataObj.date.currentTime < "16:00") return "day"
    if (dataObj.date.currentTime < dataObj.astronomical.sunset) return "evening"
    if (dataObj.date.currentTime < dataObj.astronomical.civil_twilight_end) return "sunset"
    if (dataObj.date.currentTime < dataObj.astronomical.nautical_twilight_end) return "twilight"
    if (dataObj.date.currentTime < dataObj.astronomical.astronomical_twilight_end) return "zdusk"
    if (dataObj.date.currentTime > dataObj.astronomical.astronomical_twilight_end) return "znight"

    // Fallback
    return "summer-clear-twilight"
  }

  function getCurrentWeather() {
    $.ajax({
      url: "https://api.weather.gov/gridpoints/SEW/125,67/forecast/hourly",
      dataType: "json",
      success: function (data) {
        console.log("Current weather:", data)
        dataObj.currentTemp = data.properties.periods[0].temperature
        dataObj.windSpeed = data.properties.periods[0].windSpeed
        dataObj.windDirection = data.properties.periods[0].windDirection
        dataObj.currentConditions = data.properties.periods[0].shortForecast

        if (dataObj.date.isDaytime) {
          dataObj.todayHigh = data.properties.periods[0].temperature
        }
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        // Schedule the next request when the current one's complete
        if (dataObj.date.isDaytime) {
          console.log("weather updating every 30 minutes")
          setTimeout(getCurrentWeather, 60000 * 30)
        } else {
          console.log("weather updating every 3 hours")
          setTimeout(getCurrentWeather, 3600000 * 3)
        }
      },
    })
  }

  function getWeatherForecast() {
    $.ajax({
      url: "https://api.weather.gov/gridpoints/SEW/125,67/forecast",

      dataType: "json",
      success: function (data) {
        console.log("Weather forecast: ", data)
        dataObj.shortForecast = data.properties.periods[0].shortForecast
        dataObj.detailedForecast = data.properties.periods[0].detailedForecast

        if (dataObj.date.isDaytime) {
          console.log("It is daytime")
          dataObj.todayHigh = data.properties.periods[0].temperature
          dataObj.todayLow = data.properties.periods[1].temperature
          dataObj.tomorrowHigh = data.properties.periods[2].temperature
          dataObj.tomorrowLow = data.properties.periods[3].temperature
        } else {
          dataObj.todayLow = data.properties.periods[0].temperature
          dataObj.tomorrowHigh = data.properties.periods[1].temperature
          dataObj.tomorrowLow = data.properties.periods[2].temperature
        }
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        renderInfoToScreen()
        if (date.getHours() > 6 && date.getHours() < 23) {
          console.log("weather updating every 30 minutes")
          setTimeout(getWeatherForecast, 60000 * 30)
        } else {
          console.log("weather updating every 3 hours")
          setTimeout(getWeatherForecast, 3600000 * 3)
        }
      },
    })
  }

  function populateDetailedForecast() {
    smallForecast.innerText = ""
    var splitForecast = dataObj.detailedForecast.split(".")
    splitForecast.pop() // last element is empty so remove it

    // splitForecast equal to 1
    if (splitForecast.length === 1) {
      bigForecast.innerText = `${splitForecast[0]}.`
      $(bigForecast).css("font-size", "4vw")
      $(bigForecast).css("line-height", "1.1")
    }

    // splitForecast equal to 2
    if (splitForecast.length === 2) {
      bigForecast.innerText = `${splitForecast[0]}.`
      $(bigForecast).css("font-size", "3.8vw")
      $(bigForecast).css("line-height", "1.1")
      medForecast.innerText = `${splitForecast[1]}.`
      $(medForecast).css("font-size", "3.2vw")
      $(medForecast).css("line-height", "1.1")
    }

    // splitForecast bigger than 2
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

  function renderInfoToScreen() {
    // Set elements to empty if data does not exist
    hideIfEmpty()

    // Date & Time
    dayOfWeek.innerText = dataObj.date.dayOfWeek
    todaysDate.innerText = `${dataObj.date.month} ${dataObj.date.todaysDate}`
    time.innerText = dataObj.date.displayTime

    // Temperatures
    currentTemp.innerText = `${dataObj.currentTemp}°`
    lowTemp.innerText = `${dataObj.todayLow}°`
    $(lowTemp).css("color", `rgb(${getRGB(dataObj.todayLow)})`)
    highTemp.innerText = `${dataObj.todayHigh}°`
    $(highTemp).css("color", `rgb(${getRGB(dataObj.todayHigh)})`)

    // Gradient bar
    $(tempRangeBar).css(
      "background-image",
      `linear-gradient(to right, rgb(${getRGB(dataObj.todayLow)}), rgb(${getRGB(
        dataObj.todayHigh
      )}))`
    )

    // Weather
    populateDetailedForecast()

    $(weatherIcon).removeClass().addClass(getWeatherIcon())
    $(shortForecastDisplay).text(`${dataObj.shortForecast}`)

    // Solar
    $(solarStats).html(getSolarStats())

    // Background
    console.log(`url("img/bg/${getBgImg()}.jpg")`)
    document.body.style.backgroundImage = `url("img/bg/${getBgImg()}.jpg")`

    // Change color and night to warmer tones
    if (!dataObj.date.isDaytime) {
      console.log("It's nighttime")
      var warmDisplayColor = "rgb(255, 235, 190)"

      $(todaysDate).css("color", warmDisplayColor)
      $(dayOfWeek).css("color", warmDisplayColor)
      $(bigForecast).css("color", warmDisplayColor)
      $(medForecast).css("color", warmDisplayColor)
      $(currentTemp).css("color", warmDisplayColor)
      $(smallForecast).css("color", warmDisplayColor)
      $(solarStats).children().css("color", warmDisplayColor)
      $(solarStats).children().children().children().css("color", warmDisplayColor)
      $(time).css("color", warmDisplayColor)
      $(shortForecastDisplay).css("color", warmDisplayColor)
      $(weatherIcon).css("color", warmDisplayColor)
    }

    // Recursive call
    setTimeout(renderInfoToScreen, 2000)
  }

  function hideIfEmpty() {
    if (dataObj.date.dayOfWeek === "") $(dayOfWeek).hide()
    if (dataObj.date.displayTime === "") $(time).hide()
    if (dataObj.date.month === "" || dataObj.date.todaysDate === "") $(todaysDate).hide()
    if (dataObj.date.dayOfWeek === "") $(dayOfWeek).hide()
    if (dataObj.date.detailedForecast === "") $(dayOfWeek).hide()
    if (dataObj.currentTemp === "") $(currentTemp).hide()
    if (dataObj.todayHigh === "") $(tempRangeContainer).hide()
    if (dataObj.todayLow === "") $(tempRangeContainer).hide()
    if (dataObj.date.displayTime === "") $(time).hide()
    if (dataObj.astronomical.sunrise === "") $(solarStats).hide()
    if (dataObj.astronomical.sunset === "") $(solarStats).hide()
    if (dataObj.shortForecast === "") $(shortForecastDisplay).hide()
  }

  function getRGB(temperature) {
    switch (temperature) {
      case -1:
        return "252,252,255"
      case 0:
        return "240,240,255"
      case 1:
        return "228,228,255"
      case 2:
        return "216,216,255"
      case 3:
        return "204,204,255"
      case 4:
        return "192,192,255"
      case 5:
        return "180,180,255"
      case 6:
        return "168,168,255"
      case 7:
        return "156,156,255"
      case 8:
        return "144,144,255"
      case 9:
        return "132,132,255"
      case 10:
        return "120,120,255"
      case 11:
        return "108,108,255"
      case 12:
        return "96,96,255"
      case 13:
        return "84,84,255"
      case 14:
        return "72,72,255"
      case 15:
        return "60,60,255"
      case 16:
        return "48,48,255"
      case 17:
        return "36,36,255"
      case 18:
        return "24,24,255"
      case 19:
        return "12,12,255"
      case 20:
        return "0,0,255"
      case 21:
        return "0,12,255"
      case 22:
        return "0,24,255"
      case 23:
        return "0,36,255"
      case 24:
        return "0,48,255"
      case 25:
        return "0,60,255"
      case 26:
        return "0,72,255"
      case 27:
        return "0,84,255"
      case 28:
        return "0,96,255"
      case 29:
        return "0,108,255"
      case 30:
        return "0,120,255"
      case 31:
        return "0,132,255"
      case 32:
        return "0,144,255"
      case 33:
        return "0,156,255"
      case 34:
        return "0,168,255"
      case 35:
        return "0,180,255"
      case 36:
        return "0,192,255"
      case 37:
        return "0,204,255"
      case 38:
        return "0,216,255"
      case 39:
        return "0,240,255"
      case 40:
        return "0,255,255"
      case 41:
        return "0,255,252"
      case 42:
        return "0,255,240"
      case 43:
        return "0,255,228"
      case 44:
        return "0,255,216"
      case 45:
        return "0,255,204"
      case 46:
        return "0,255,192"
      case 47:
        return "0,255,180"
      case 48:
        return "0,255,168"
      case 49:
        return "0,255,156"
      case 50:
        return "0,255,144"
      case 51:
        return "0,255,132"
      case 52:
        return "0,255,120"
      case 53:
        return "0,255,108"
      case 54:
        return "0,255,96"
      case 55:
        return "0,255,84"
      case 56:
        return "0,255,72"
      case 57:
        return "0,255,60"
      case 58:
        return "0,255,48"
      case 59:
        return "0,255,36"
      case 60:
        return "0,255,0"
      case 61:
        return "12,255,0"
      case 62:
        return "24,255,0"
      case 63:
        return "36,255,0"
      case 64:
        return "48,255,0"
      case 65:
        return "60,255,0"
      case 66:
        return "72,255,0"
      case 67:
        return "84,255,0"
      case 68:
        return "96,255,0"
      case 69:
        return "108,255,0"
      case 70:
        return "120,255,0"
      case 71:
        return "132,255,0"
      case 72:
        return "144,255,0"
      case 73:
        return "156,255,0"
      case 74:
        return "168,255,0"
      case 75:
        return "180,255,0"
      case 76:
        return "192,255,0"
      case 77:
        return "204,255,0"
      case 78:
        return "216,255,0"
      case 79:
        return "228,255,0"
      case 80:
        return "255,255,0"
      case 81:
        return "255,240,0"
      case 82:
        return "255,228,0"
      case 83:
        return "255,216,0"
      case 84:
        return "255,204,0"
      case 85:
        return "255,192,0"
      case 86:
        return "255,180,0"
      case 87:
        return "255,168,0"
      case 88:
        return "255,156,0"
      case 89:
        return "255,144,0"
      case 90:
        return "255,132,0"
      case 91:
        return "255,120,0"
      case 92:
        return "255,108,0"
      case 93:
        return "255,96,0"
      case 94:
        return "255,84,0"
      case 95:
        return "255,72,0"
      case 96:
        return "255,60,0"
      case 97:
        return "255,48,0"
      case 98:
        return "255,36,0"
      case 99:
        return "255,24,0"
      case 100:
        return "255,0,0"
      case 101:
        return "255,12,12"
      case 102:
        return "255,24,24"
      case 103:
        return "255,36,36"
      case 104:
        return "255,48,48"
      case 105:
        return "255,60,60"
      case 106:
        return "255,72,72"
      case 107:
        return "255,84,84"
      case 108:
        return "255,96,96"
      case 109:
        return "255,108,108"
      case 110:
        return "255,120,120"
      case 111:
        return "255,132,132"
      case 112:
        return "255,144,144"
      case 113:
        return "255,156,156"
      case 114:
        return "255,168,168"
      case 115:
        return "255,180,180"
      case 116:
        return "255,192,192"
      case 117:
        return "255,204,204"
      case 118:
        return "255,216,216"
      case 119:
        return "255,228,228"
      case 120:
        return "255,240,240"
      case 121:
        return "255,252,252"
      default:
        return "255,255,255"
    }
  }

  function getWeatherIcon() {
    // day or night
    if (dataObj.shortForecast === "") return ""
    if (dataObj.shortForecast.toLowerCase().includes("snow")) return "fas fa-snowflake"
    if (dataObj.shortForecast.toLowerCase().includes("thunder")) return "fas fa-bolt"
    if (dataObj.shortForecast.toLowerCase().includes("smoke")) return "fas fa-smog"
    if (dataObj.shortForecast.toLowerCase().includes("smog")) return "fas fa-smog"

    // daytime
    if (dataObj.date.isDaytime) {
      if (dataObj.shortForecast.toLowerCase() === "sunny") return "fas fa-sun"
      if (dataObj.shortForecast.toLowerCase() === "mostly sunny") return "fas fa-sun"
      if (dataObj.shortForecast.toLowerCase() === "partly sunny") return "fas fa-cloud-sun"
      if (dataObj.shortForecast.toLowerCase() === "partly cloudy") return "fas fa-cloud-sun"
      if (dataObj.shortForecast.toLowerCase() === "chance rain showers")
        return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "mostly cloudy") return "fas fa-cloud-sun"
      if (dataObj.shortForecast.toLowerCase() === "cloudy") return "fas fa-cloud"
      if (dataObj.shortForecast.toLowerCase().includes("light rain")) return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase().includes("showers")) return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase().includes("rain")) return "fas fa-cloud-showers-heavy"
      if (dataObj.shortForecast.toLowerCase().includes("clear")) return "fas fa-sun"
      return "fas fa-cloud-sun"
    } else if (!dataObj.date.isDaytime) {
      // nighttime
      if (dataObj.shortForecast.toLowerCase() === "clear") return "fas fa-moon"
      if (dataObj.shortForecast.toLowerCase() === "mostly clear") return "fas fa-moon"
      if (dataObj.shortForecast.toLowerCase() === "partly clear") return "fas fa-cloud-moon"
      if (dataObj.shortForecast.toLowerCase() === "partly cloudy") return "fas fa-cloud-moon"
      if (dataObj.shortForecast.toLowerCase() === "chance rain showers")
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase().includes("light rain"))
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase().includes("showers")) return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase().includes("heavy rain"))
        return "fas fa-cloud-showers-heavy"
    } else {
      return "fas fa-rainbow"
    }
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

    return `
    <div class="sunriseContainer">
      <div class="sunriseIcons">
        <i id="arrowUp" class="fas fa-chevron-up"></i>
        <i id="sunUp" class="fas fa-sun"></i>
      </div>
      ${sr}am &nbsp;&nbsp;&nbsp;
      <div class="sunriseIcons">
        <i id="sunDown" class="fas fa-sun"></i>
        <i id="arrowDown" class="fas fa-chevron-down"></i>
      </div>
      ${ss}pm
    </div>`
  }

  function getBgImg() {
    var conditions = dataObj.shortForecast.replace(/\s/g, "").toLowerCase()
    var string = `${dataObj.date.season}-${conditions}-${dataObj.date.currentTimePeriod}`.toLowerCase()
    return string
  }
}) // end jQuery
