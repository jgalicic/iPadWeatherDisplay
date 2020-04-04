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
  const highTemp = document.getElementById("highTemp")
  const weatherIcon = document.getElementById("weatherIcon")
  const bigForecast = document.getElementById("bigForecast")
  const medForecast = document.getElementById("medForecast")
  const smallForecast = document.getElementById("smallForecast")
  const solarStats = document.getElementById("solarStats")
  var loadPageOneTime = true // for testing purposes
  var date = new Date()

  var dataObj = {
    aqi: 28,
    astronomical: {
      astronomical_twilight_begin: "04:51",
      astronomical_twilight_end: "21:32",
      civil_twilight_begin: "06:09",
      civil_twilight_end: "20:14",
      day_length: "06:02",
      moon: { age: "", moonrise: "", moonset: "", phase: "" },
      nautical_twilight_begin: "05:31",
      nautical_twilight_end: "20:52",
      solar_noon: "13:12",
      sunrise: "06:40",
      sunset: "19:43",
    },
    bestDayToGetOutside: "",
    chancePrecipitation: 10,
    chanceThunder: 0,
    currentConditions: "Chance Rain Showers",
    currentTemp: 50,
    dayLength: "",
    detailedForecast:
      "A chance of rain showers. Mostly cloudy, with a high near 46. West northwest wind 10 to 15 mph, with gusts as high as 21 mph. Chance of precipitation is 50%. New rainfall amounts less than a tenth of an inch possible.",
    humitidy: 66,
    isDaytime: true,
    pressure: 30.09,
    pressureDirection: "falling",
    shortForecast: "Chance Rain Showers",
    snow: { chanceSnow: 0, snowAccumInchesMax: 0, snowAccumInchesMin: 0 },
    todayHigh: 50,
    todayLow: 50,
    tomorrowHigh: 48,
    tomorrowLow: 38,
    uvIndex: 1,
    visibilityMiles: 10,
    windDirection: "WSW",
    windSpeed: "15 mph",
  }

  var todayHigh = 0

  getCurrentWeather()
  getWeatherForecast()
  getSolarData()
  renderInfoToScreen()

  function renderInfoToScreen() {
    date = new Date()

    // for testing purposes
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

    setTimeout(function () {
      // Weather
      if (dataObj.currentTemp) {
        currentTemp.innerText = `${dataObj.currentTemp}°`
      }
      if (dataObj.todayHigh && dataObj.todayLow) {
        lowTemp.innerText = `${dataObj.todayLow}°`
        $(lowTemp).css("color", `rgb(${getRGB(dataObj.todayLow)})`)
        highTemp.innerText = `${dataObj.todayHigh}°`
        $(highTemp).css("color", `rgb(${getRGB(dataObj.todayHigh)})`)
        // Gradient bar
        $(tempRangeBar).css({
          background: `-webkit-linear-gradient(left, rgb(${getRGB(dataObj.todayLow)}), rgb(${getRGB(
            dataObj.todayHigh
          )})`,
        })
      }
    }, 2000)

    // background: -webkit-linear-gradient(left, black, white);

    $(weatherIcon).addClass(getWeatherIcon())

    // Solar
    $(solarStats).text(getSolarStats())

    // Background images
    document.body.style.backgroundImage = `url("img/bg/${getBgImg(date)}.jpg")`
    setTimeout(renderInfoToScreen, 2000)
  }

  function getWeatherForecast() {
    $.ajax({
      url: "https://api.weather.gov/gridpoints/SEW/125,67/forecast",

      dataType: "json",
      success: function (data) {
        console.log("!", data)
        dataObj.shortForecast = data.properties.periods[0].shortForecast
        dataObj.detailedForecast = data.properties.periods[0].detailedForecast
        populateDetailedForecast(dataObj)

        // Check if it's daytime
        if (data.properties.periods[0].isDaytime) {
          dataObj.todayHigh = data.properties.periods[0].temperature
          dataObj.todayLow = data.properties.periods[1].temperature
          dataObj.tomorrowHigh = data.properties.periods[2].temperature
          dataObj.tomorrowLow = data.properties.periods[3].temperature
        } else {
          if (todayHigh > 1) {
            dataObj.todayHigh = todayHigh
          } else {
            dataObj.todayHigh = dataObj.todayHigh
            dataObj.todayLow = data.properties.periods[0].temperature
            dataObj.tomorrowHigh = data.properties.periods[1].temperature
            dataObj.tomorrowLow = data.properties.periods[2].temperature
          }
        }
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        if (date.getHours() > 7 && date.getHours() < 22) {
          console.log("weather updating every 30 minutes")
          setTimeout(getWeatherForecast, 60000 * 30)
        } else {
          console.log("weather updating every 3 hours")
          setTimeout(getWeatherForecast, 3600000 * 3)
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

        if (data.properties.periods[0].isDaytime) {
          todayHigh = data.properties.periods[0].temperature
        }
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        // Schedule the next request when the current one's complete
        if (date.getHours() > 7 && date.getHours() < 22) {
          console.log("weather updating every 30 minutes")
          setTimeout(getCurrentWeather, 60000 * 30)
        } else {
          console.log("weather updating every 3 hours")
          setTimeout(getCurrentWeather, 3600000 * 3)
        }
      },
    })
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

  function getBgImg(date) {
    // If Victor's not home
    if (date.getHours() > 7 && date.getHours() < 20 && date.getDay() !== 0 && date.getDay() !== 6) {
      if (dataObj.isDaytime) return "summer-mostlyclear-day"
      return "summer-mostlyclear-day"
    }
    // Victor's mom's pics
    else {
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
        if (date.getHours() === 0) {
          setTimeout(getSolarData, 60000)
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
