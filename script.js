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

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  const dayOfWeek = document.getElementById("dayOfWeek")
  const todaysDate = document.getElementById("todaysDate")
  const time = document.getElementById("time")
  const currentTemp = document.getElementById("currentTemp")
  const degreeSymbol = document.getElementById("degreeSymbol")
  const lowTemp = document.getElementById("lowTemp")
  const tempRangeBar = document.getElementById("tempRangeBar")
  const tempRangeContainer = document.getElementById("tempRangeContainer")
  const tempRangeBg = document.getElementById("tempRangeBg")
  const highTemp = document.getElementById("highTemp")
  const weatherIcon = document.getElementById("weatherIcon")
  const detailedForecast = document.getElementById("detailedForecast")
  const bigForecast = document.getElementById("bigForecast")
  const medForecast = document.getElementById("medForecast")
  const smallForecast = document.getElementById("smallForecast")
  const solarStats = document.getElementById("solarStats")
  const sunriseTime = document.getElementById("sunriseTime")
  const sunsetTime = document.getElementById("sunsetTime")
  const shortForecastDisplay = document.getElementById("shortForecastDisplay")
  var globalDate = new Date()
  var timeString = globalDate.toTimeString().substring(0, 5)
  dayArray = []

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
      isDaytime: "",
      millis: null,
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
    shortForecast: "",
    shortForecastForBg: "",
    snow: {
      chanceSnow: null,
      snowAccumInchesMax: null,
      snowAccumInchesMin: null,
    },
    todayHigh: null,
    todayLow: null,
    tomorrowHigh: null,
    tomorrowLow: null,
    uvIndex: null,
    visibilityMiles: null,
    windDirection: "",
    windSpeed: "",
  }

  ///////////////////////////////////
  ///////////////////////////////////
  ///////// For development /////////
  ///////////////////////////////////
  ///////////////////////////////////

  // dataObj = {
  //   aqi: null,
  //   astronomical: {
  //     astronomical_twilight_begin: "04:42",
  //     astronomical_twilight_end: "21:39",
  //     civil_twilight_begin: "06:01",
  //     civil_twilight_end: "20:20",
  //     day_length: "06:15",
  //     moon: {
  //       age: "",
  //       moonrise: "",
  //       moonset: "",
  //       phase: "",
  //     },
  //     nautical_twilight_begin: "05:23",
  //     nautical_twilight_end: "20:58",
  //     solar_noon: "13:10",
  //     sunrise: "06:32",
  //     sunset: "19:48",
  //   },
  //   bestDayToGetOutside: "",
  //   chanceHail: null,
  //   chancePrecipitation: null,
  //   chanceRain: null,
  //   chanceThunder: null,
  //   currentConditions: "Sunny",
  //   currentTemp: 55,
  //   date: {
  //     currentTime: "13:27",
  //     currentTimePeriod: "day",
  //     dayOfWeek: "Wednesday",
  //     displayTime: "1:27",
  //     isDaytime: "true",
  //     millis: null,
  //     month: "June",
  //     season: "Spring",
  //     todaysDate: 21,
  //     year: 2020,
  //   },
  //   detailedForecast:
  //     "Mostly sunny, with a high near 56. Northwest wind 1 to 5 mph.",
  //   humitidy: null,
  //   pollen: {
  //     grass: null,
  //     overall: null,
  //     tree: null,
  //     ragweed: null,
  //   },
  //   pressure: null,
  //   pressureDirection: "",
  //   shortForecast: "Sunny",
  //   shortForecastForBg: "Sunny",
  //   snow: {
  //     chanceSnow: null,
  //     snowAccumInchesMax: null,
  //     snowAccumInchesMin: null,
  //   },
  //   todayHigh: 76,
  //   todayLow: 60,
  //   tomorrowHigh: 60,
  //   tomorrowLow: 42,
  //   uvIndex: null,
  //   visibilityMiles: null,
  //   windDirection: "WSW",
  //   windSpeed: "1 mph",
  // }

  // setTimeout(() => {
  //   console.log(dataObj)
  // }, 200)

  // setTimeout(() => {
  //   updateTime()
  //   populateDetailedForecast()
  //   renderBackground()
  //   renderSolarAndWeatherDataToScreen()
  //   renderSunriseAndSunsetDisplay()
  // }, 300)

  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////

  initializeInfoRequests()

  function initializeInfoRequests() {
    getDateInfo(function () {
      getSolarData(function () {
        getCurrentTimePeriod()
        getCurrentWeather()
        // console.log(dataObj)
      })
    })
  }

  function getDateInfo(callback) {
    date = new Date()
    timeString = date.toTimeString().substring(0, 5)

    // Populate dataObj with date & time data
    dataObj.date.currentTime = timeString
    dataObj.date.displayTime = date
      .toLocaleTimeString()
      .match(/[0-9]+[:][0-9]+/g)[0]
    dataObj.date.millis = Date.now()
    dataObj.date.dayOfWeek = dayNames[date.getDay()]
    dataObj.date.month = monthNames[date.getMonth()]
    dataObj.date.todaysDate = date.getDate()
    dataObj.date.season = getSeason()
    dataObj.date.year = date.getFullYear()

    callback()
  }

  function getSeason() {
    if (dataObj.date.millis < 1616223600000) return "Winter"
    // 2021
    if (dataObj.date.millis < 1624172400000) return "Spring"
    if (dataObj.date.millis < 1632294000000) return "Summer"
    if (dataObj.date.millis < 1640073600000) return "Fall"
    if (dataObj.date.millis < 1647759600000) return "Winter"
    // 2022
    if (dataObj.date.millis < 1655794800000) return "Spring"
    if (dataObj.date.millis < 1663830000000) return "Summer"
    if (dataObj.date.millis < 1671609600000) return "Fall"
    if (dataObj.date.millis < 1679295600000) return "Winter"
  }

  function getSolarData(callback) {
    $.ajax({
      url: "https://api.sunrise-sunset.org/json?lat=47.6&lng=-122.3",
      dataType: "json",
      success: function (data) {
        var d = new Date()

        for (var key in data.results) {
          var myDate = new Date(
            `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${
              data.results[key]
            } UTC`
          )
          dataObj.astronomical[key] = myDate
            .toTimeString()
            .match(/[0-9]+[:][0-9]+/g)[0]
        }
        if (
          dataObj.date.currentTime > dataObj.astronomical.sunrise &&
          dataObj.date.currentTime < dataObj.astronomical.sunset
        ) {
          dataObj.date.isDaytime = "true"
        } else {
          dataObj.date.isDaytime = "false"
        }
        // console.log(data)
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        callback()
      },
    })
  }

  function getCurrentTimePeriod() {
    dayArray = [
      dataObj.astronomical.astronomical_twilight_begin,
      "znight",
      dataObj.astronomical.nautical_twilight_begin,
      "znight",
      dataObj.astronomical.civil_twilight_begin,
      "_beforesunrise",
      dataObj.astronomical.sunrise,
      "_sunrise",
      "08:30",
      "am",
      "10:30",
      "amlate",
      "14:00",
      "day",
      "16:30",
      "dayafternoon",
      dataObj.astronomical.sunset,
      "evening",
      dataObj.astronomical.civil_twilight_end,
      "sunset",
      dataObj.astronomical.nautical_twilight_end,
      "twilight",
      dataObj.astronomical.astronomical_twilight_end,
      "zdusk",
      "23:59",
      "znight",
    ]
    for (var i = 0; i < dayArray.length; i += 2) {
      if (dataObj.date.currentTime <= dayArray[i]) {
        dataObj.date.currentTimePeriod = dayArray[i + 1]
        return
      }
    }
  }

  function getCurrentWeather() {
    $.ajax({
      url: "https://api.weather.gov/gridpoints/SEW/124,67/forecast/hourly",
      dataType: "json",
      success: function (data) {
        var tracker = 0
        var MAX = 10

        while (tracker < MAX) {
          if (
            dataObj.date.currentTime.substring(
              0,
              2 === data.properties.periods[tracker].startTime.substring(11, 13)
            )
          ) {
            break
          } else if (
            dataObj.date.currentTime >
            data.properties.periods[tracker].startTime.substring(11, 16)
          ) {
            tracker++
          } else {
            break
          }
          if (
            data.properties.periods[tracker].startTime.substring(11, 16) ==
            "00:00"
          ) {
            break
          }
        }

        // console.log("Current weather: ", data.properties.periods)

        dataObj.currentTemp = data.properties.periods[tracker].temperature
        dataObj.windSpeed = data.properties.periods[tracker].windSpeed
        dataObj.windDirection = data.properties.periods[tracker].windDirection
        dataObj.shortForecast = data.properties.periods[tracker].shortForecast

        // Populate dataObj.shortForecastForBg
        /* Options: Clear, Cloudy, Fog, Mostly Clear, Mostly Sunny, Partly Cloudy, Rain,
                    Slight Chance Light Rain, Snow, Sunny */
        if (
          data.properties.periods[tracker].shortForecast
            .toLowerCase()
            .includes("thunderstorms")
        ) {
          dataObj.shortForecastForBg = "Thunder"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "chance light rain"
        ) {
          dataObj.shortForecastForBg = "Slight Chance Light Rain"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "slight chance rain showers"
        ) {
          dataObj.shortForecastForBg = "Slight Chance Light Rain"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "chance rain showers"
        ) {
          dataObj.shortForecastForBg = "Slight Chance Light Rain"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "scattered rain showers"
        ) {
          dataObj.shortForecastForBg = "Slight Chance Light Rain"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "areas of drizzle"
        ) {
          dataObj.shortForecastForBg = "Slight Chance Light Rain"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "patchy drizzle"
        ) {
          dataObj.shortForecastForBg = "Slight Chance Light Rain"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "light rain likely"
        ) {
          dataObj.shortForecastForBg = "Slight Chance Light Rain"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "light rain"
        ) {
          dataObj.shortForecastForBg = "Slight Chance Light Rain"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "rain showers likely"
        ) {
          dataObj.shortForecastForBg = "Slight Chance Light Rain"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "rain showers"
        ) {
          dataObj.shortForecastForBg = "Slight Chance Light Rain"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "partly sunny"
        ) {
          dataObj.shortForecastForBg = "Partly Cloudy"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "ares of fog"
        ) {
          dataObj.shortForecastForBg = "Clear"
        } else if (
          data.properties.periods[tracker].shortForecast.toLowerCase() ===
          "patchy fog"
        ) {
          dataObj.shortForecastForBg = "Clear"
        } else {
          dataObj.shortForecastForBg =
            data.properties.periods[tracker].shortForecast
        }
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        // console.log("Got weather")
        getWeatherForecast()
      },
    })
  }

  function getWeatherForecast() {
    $.ajax({
      url: "https://api.weather.gov/gridpoints/SEW/124,67/forecast",

      dataType: "json",
      success: function (data) {
        // console.log("Weather forecast: ", data)

        if (
          dataObj.date.currentTime >= "00:00" &&
          dataObj.date.currentTime < dataObj.astronomical.sunrise
        ) {
          console.log("It is after mignight and before sunrise")
          if (
            data.properties.periods[0].name.toLowerCase() === "tonight" ||
            data.properties.periods[0].name.toLowerCase() === "overnight"
          ) {
            dataObj.detailedForecast =
              data.properties.periods[0].detailedForecast
            dataObj.todayLow = data.properties.periods[0].temperature
            dataObj.tomorrowHigh = data.properties.periods[1].temperature
            dataObj.tomorrowLow = data.properties.periods[2].temperature
          } else if (
            data.properties.periods[1].name.toLowerCase() === "tonight" ||
            data.properties.periods[1].name.toLowerCase() === "overnight"
          ) {
            dataObj.todayHigh = data.properties.periods[0].temperature
            dataObj.detailedForecast =
              data.properties.periods[1].detailedForecast
            dataObj.todayLow = data.properties.periods[1].temperature
            dataObj.tomorrowHigh = data.properties.periods[2].temperature
            dataObj.tomorrowLow = data.properties.periods[3].temperature
          } else {
            console.log("Check data.properties.periods[0]!")
          }
        } else if (
          dataObj.date.currentTime >= dataObj.astronomical.sunrise &&
          dataObj.date.currentTime < "12:00"
        ) {
          console.log("It is after sunrise and before 12 noon")
          if (
            data.properties.periods[0].name.toLowerCase() === "today" ||
            data.properties.periods[0].name.toLowerCase() === "this morning"
          ) {
            dataObj.detailedForecast =
              data.properties.periods[0].detailedForecast
            dataObj.todayHigh = data.properties.periods[0].temperature
            dataObj.todayLow = data.properties.periods[1].temperature
            dataObj.tomorrowHigh = data.properties.periods[2].temperature
            dataObj.tomorrowLow = data.properties.periods[3].temperature
          } else if (
            data.properties.periods[0].name.toLowerCase() === "overnight" ||
            data.properties.periods[0].name.toLowerCase() === "last night" ||
            data.properties.periods[0].name.toLowerCase() === "tonight"
          ) {
            dataObj.detailedForecast =
              data.properties.periods[1].detailedForecast
            dataObj.todayHigh = data.properties.periods[1].temperature
            dataObj.todayLow = data.properties.periods[2].temperature
            dataObj.tomorrowHigh = data.properties.periods[3].temperature
            dataObj.tomorrowLow = data.properties.periods[4].temperature
          } else {
            console.log("Check data.properties.periods[0]!")
            console.log(data.properties.periods)
          }
        } else if (
          dataObj.date.currentTime >= "12:00" &&
          dataObj.date.currentTime < dataObj.astronomical.sunset
        ) {
          console.log("It is after noon and before sunset")
          // console.log(dataObj)
          // console.log(data.properties.periods[1].name.toLowerCase())
          // console.log(data.properties.periods[1].name.toLowerCase())
          // console.log(data.properties.periods[1].name.toLowerCase() === dataObj.date.dayOfWeek.toLowerCase())
          if (
            data.properties.periods[0].name.toLowerCase() === "today" ||
            data.properties.periods[0].name.toLowerCase() ===
              "this afternoon" ||
            data.properties.periods[0].name.toLowerCase() ===
              dataObj.date.dayOfWeek.toLowerCase()
          ) {
            dataObj.todayHigh = data.properties.periods[0].temperature
            dataObj.detailedForecast =
              data.properties.periods[0].detailedForecast
            dataObj.todayLow = data.properties.periods[1].temperature
            dataObj.tomorrowHigh = data.properties.periods[2].temperature
            dataObj.tomorrowLow = data.properties.periods[3].temperature
          } else if (
            data.properties.periods[1].name.toLowerCase() === "today" ||
            data.properties.periods[1].name.toLowerCase() ===
              "this afternoon" ||
            data.properties.periods[1].name.toLowerCase() ===
              dataObj.date.dayOfWeek.toLowerCase()
          ) {
            dataObj.todayHigh = data.properties.periods[1].temperature
            dataObj.detailedForecast =
              data.properties.periods[1].detailedForecast
            dataObj.todayLow = data.properties.periods[2].temperature
            dataObj.tomorrowHigh = data.properties.periods[3].temperature
            dataObj.tomorrowLow = data.properties.periods[4].temperature
          } else {
            console.log("Check data.properties.periods[0]!")
            console.log(data.properties.periods)
          }
        } else if (
          dataObj.date.currentTime >= dataObj.astronomical.sunset &&
          dataObj.date.currentTime <= "23:59"
        ) {
          console.log("It is after sunset and before midnight")

          if (
            data.properties.periods[0].name.toLowerCase() === "tonight" ||
            data.properties.periods[0].name.toLowerCase() === "overnight"
          ) {
            dataObj.todayLow = data.properties.periods[0].temperature
            dataObj.detailedForecast =
              data.properties.periods[0].detailedForecast
            dataObj.tomorrowHigh = data.properties.periods[1].temperature
            dataObj.tomorrowLow = data.properties.periods[2].temperature
          } else if (
            data.properties.periods[1].name.toLowerCase() === "tonight" ||
            data.properties.periods[1].name.toLowerCase() === "overnight"
          ) {
            dataObj.todayHigh = data.properties.periods[0].temperature
            dataObj.detailedForecast =
              data.properties.periods[1].detailedForecast
            dataObj.todayLow = data.properties.periods[1].temperature
            dataObj.tomorrowHigh = data.properties.periods[2].temperature
            dataObj.tomorrowLow = data.properties.periods[3].temperature
          } else {
            console.log("Check data.properties.periods[0]!")
            console.log(data.properties.periods)
          }
        }

        if (dataObj.todayHigh === null) {
          getPseudoHigh()
        }
      },
      error: function (data, status, error) {
        console.log(data)
        console.log(status)
        console.log(error)
      },
      complete: function () {
        populateDetailedForecast()
        renderBackground()
        renderSolarAndWeatherDataToScreen()
        renderSunriseAndSunsetDisplay()

        // Change color and night to warmer tones
        if (dataObj.date.isDaytime === "false") {
          renderNightTimeMode()
        } else {
          renderDayTimeMode()
        }

        // Set display elements to empty if data does not exist
        hideIfEmpty()

        updateTime() // This should go last
      },
    })
  }

  function getPseudoHigh() {
    // console.log("Getting pseudoHigh")
    var pseudoHigh = dataObj.currentTemp
    if (dataObj.date.currentTimePeriod === "dayafternoon") pseudoHigh += 4
    if (dataObj.date.currentTimePeriod === "evening") pseudoHigh += 5
    if (dataObj.date.currentTimePeriod === "sunset") pseudoHigh += 6
    if (dataObj.date.currentTimePeriod === "twilight") pseudoHigh += 7
    if (dataObj.date.currentTimePeriod === "zdusk") pseudoHigh += 8
    if (dataObj.date.currentTimePeriod === "znight") pseudoHigh += 9
    if (dataObj.date.season.toLowerCase() === "spring") pseudoHigh += 1
    if (dataObj.date.season.toLowerCase() === "summer") pseudoHigh += 1
    if (dataObj.shortForecast.includes("clear")) pseudoHigh += 2
    if (dataObj.shortForecast.includes("rain")) pseudoHigh -= 2
    dataObj.todayHigh = pseudoHigh
    // console.log(dataObj)
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

  function updateTime() {
    // Date & Time
    var d = new Date()
    var m = d.getMinutes()
    var s = d.getSeconds()
    var h = d.getHours()

    timeString = d.toTimeString().substring(0, 5)

    // Populate dataObj with date & time data
    dataObj.date.currentTime = timeString
    dataObj.date.displayTime = d
      .toLocaleTimeString()
      .match(/[0-9]+[:][0-9]+/g)[0]
    time.innerText = dataObj.date.displayTime
    dayOfWeek.innerText = dataObj.date.dayOfWeek
    todaysDate.innerText = `${dataObj.date.month} ${dataObj.date.todaysDate}`

    // Refresh background image every 30 minutes
    if ((m === 0 && s === 0) || (m === 30 && s === 0)) {
      renderBackground()
    }

    // Refresh API data at sunrise and sunset
    if (
      dataObj.date.currentTime === dataObj.astronomical.sunrise ||
      dataObj.date.currentTime === dataObj.astronomical.sunset
    ) {
      if (s === 0) {
        setTimeout(function () {
          initializeInfoRequests()
          // console.log("Initialized request!")
        }, 1000)
      }
    }

    // Refresh API data every 60 minutes
    if (m === 0 && s === 0) {
      // console.log("About to initialize request")

      if (h >= 1 && h <= 5) {
        // Refresh page every day at 5am
        if (h === 5) {
          location.reload(true)
        }
        setTimeout(updateTime, 1000)
      } else {
        setTimeout(function () {
          initializeInfoRequests()
          // console.log("Initialized request!")
        }, 1000)
      }
    } else {
      // Recursive call
      setTimeout(updateTime, 1000)
    }

    // Special: Refresh at 9:30pm and 9:45pm around summer solstice
    if (dataObj.date.month.toLowerCase() === "june" && h === 21 && s === 0) {
      if (m === 30 || m === 45) {
        setTimeout(function () {
          initializeInfoRequests()
        }, 1000)
      }
    }
  }

  function renderSolarAndWeatherDataToScreen() {
    // Weather Icon
    $(weatherIcon).removeClass().addClass(getWeatherIcon())
    if (dataObj.shortForecast !== null)
      $(shortForecastDisplay).text(`${dataObj.shortForecast}`)
    // Temperature
    if (dataObj.currentTemp !== null)
      $(currentTemp).html(`${dataObj.currentTemp}`)
    if (dataObj.currentTemp === null) $(degreeSymbol).html("")
    if (dataObj.todayLow !== null) lowTemp.innerText = `${dataObj.todayLow}°`
    $(lowTemp).css("color", `rgb(${getRGB(dataObj.todayLow)})`)
    if (dataObj.todayHigh !== null) highTemp.innerText = `${dataObj.todayHigh}°`
    $(highTemp).css("color", `rgb(${getRGB(dataObj.todayHigh)})`)

    // Gradient bar
    $(tempRangeBar).css(
      "background-image",
      `linear-gradient(to right, rgb(${getRGB(dataObj.todayLow)}), rgb(${getRGB(
        dataObj.todayHigh
      )}))`
    )
  }

  function renderBackground() {
    if (dataObj.shortForecast === "" || getBgImg().length < 1) {
      // Purple gradient
      $("body").css({
        background:
          "linear-gradient(180deg, rgba(38,46,182,1) 0%, rgba(40,37,145,1) 25%, rgba(62,20,115,1) 50%, rgba(66,12,101,1) 75%, rgba(102,13,62,1) 100%)",
      })
    } else {
      document.body.style.backgroundImage = `url("img/bg/${getBgImg()}.jpg")`
    }
  }

  function hideIfEmpty() {
    if (dataObj.date.dayOfWeek === "") $(dayOfWeek).hide()
    if (dataObj.date.displayTime === "") $(time).hide()
    if (dataObj.date.month === "" || dataObj.date.todaysDate === "")
      $(todaysDate).hide()
    if (dataObj.date.dayOfWeek === "") $(dayOfWeek).hide()
    if (dataObj.currentTemp === null) $(tempRangeBar).hide()
    if (dataObj.currentTemp === null) $(tempRangeBg).hide()
    if (dataObj.todayHigh === null) $(tempRangeContainer).hide()
    if (dataObj.todayLow === null) $(tempRangeContainer).hide()
    if (dataObj.date.displayTime === "") $(time).hide()
    if (dataObj.astronomical.sunrise === "") $(solarStats).hide()
    if (dataObj.astronomical.sunset === "") $(solarStats).hide()
    if (dataObj.shortForecast === "") $(shortForecastDisplay).hide()
    if (dataObj.detailedForecast === "") $(detailedForecast).hide()
  }

  function getRGB(temperature) {
    const tempInt = parseInt(temperature)
    switch (tempInt) {
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
        return "0,255,128"
      case 52:
        return "0,255,112"
      case 53:
        return "0,255,80"
      case 54:
        return "0,255,64"
      case 55:
        return "0,255,48"
      case 56:
        return "0,255,32"
      case 57:
        return "0,255,16"
      case 58:
        return "16,255,0"
      case 59:
        return "32,255,0"
      case 60:
        return "48,255,0"
      case 61:
        return "64,255,0"
      case 62:
        return "80,255,0"
      case 63:
        return "112,255,0"
      case 64:
        return "128,255,0"
      case 65:
        return "144,255,0"
      case 66:
        return "160,255,0"
      case 67:
        return "176,255,0"
      case 68:
        return "192,255,0"
      case 69:
        return "204,255,0"
      case 70:
        return "216,255,0"
      case 71:
        return "228,255,0"
      case 72:
        return "240,255,0"
      case 73:
        return "252,255,0"
      case 74:
        return "255,255,0"
      case 75:
        return "255,244,0"
      case 76:
        return "255,232,0"
      case 77:
        return "255,220,0"
      case 78:
        return "255,208,0"
      case 79:
        return "255,196,0"
      case 80:
        return "255,184,0"
      case 81:
        return "255,172,0"
      case 82:
        return "255,160,0"
      case 83:
        return "255,148,0"
      case 84:
        return "255,136,0"
      case 85:
        return "255,124,0"
      case 86:
        return "255,112,0"
      case 87:
        return "255,100,0"
      case 88:
        return "255,88,0"
      case 89:
        return "255,76,0"
      case 90:
        return "255,64,0"
      case 91:
        return "255,52,0"
      case 92:
        return "255,40,0"
      case 93:
        return "255,28,0"
      case 94:
        return "255,16,0"
      case 95:
        return "255,4,0"
      case 96:
        return "255,10,10"
      case 97:
        return "255,20,20"
      case 98:
        return "255,30,30"
      case 99:
        return "255,40,40"
      case 100:
        return "255,50,50"
      case 101:
        return "255,60,60"
      case 102:
        return "255,70,70"
      case 103:
        return "255,80,80"
      case 104:
        return "255,90,90"
      case 105:
        return "255,100,100"
      case 106:
        return "255,110,110"
      case 107:
        return "255,120,120"
      case 108:
        return "255,130,130"
      case 109:
        return "255,140,140"
      case 110:
        return "255,150,150"
      case 111:
        return "255,160,160"
      case 112:
        return "255,170,170"
      case 113:
        return "255,180,180"
      case 114:
        return "255,190,190"
      case 115:
        return "255,200,200"
      case 116:
        return "255,210,210"
      case 117:
        return "255,220,220"
      case 118:
        return "255,230,230"
      case 119:
        return "255,235,235"
      case 120:
        return "255,240,240"
      case 121:
        return "255,252,252"
      default:
        return "255,255,255"
    }
  }

  function getWeatherIcon() {
    // console.log("Got weather icon")
    // day or night
    if (dataObj.shortForecast === "") return ""
    if (dataObj.shortForecast.toLowerCase().includes("snow"))
      return "fas fa-snowflake"
    if (dataObj.shortForecast.toLowerCase().includes("thunder"))
      return "fas fa-bolt"
    if (dataObj.shortForecast.toLowerCase().includes("smoke"))
      return "fas fa-smog"
    if (dataObj.shortForecast.toLowerCase().includes("smog"))
      return "fas fa-smog"

    // daytime
    if (dataObj.date.isDaytime === "true") {
      if (dataObj.shortForecast.toLowerCase() === "sunny") return "sunshine"
      if (dataObj.shortForecast.toLowerCase() === "mostly sunny")
        return "sunshine"
      if (dataObj.shortForecast.toLowerCase() === "clear") return "sunshine"
      if (dataObj.shortForecast.toLowerCase() === "mostly clear")
        return "sunshine"
      if (dataObj.shortForecast.toLowerCase() === "areas of fog")
        return "sunshine"
      //
      if (dataObj.shortForecast.toLowerCase() === "patchy fog")
        return "sunshine"
      //
      if (dataObj.shortForecast.toLowerCase() === "partly sunny")
        return "fas fa-cloud-sun"
      if (dataObj.shortForecast.toLowerCase() === "partly cloudy")
        return "fas fa-cloud-sun"
      if (dataObj.shortForecast.toLowerCase() === "mostly cloudy")
        return "fas fa-cloud-sun"
      if (dataObj.shortForecast.toLowerCase() === "cloudy")
        return "fas fa-cloud"
      if (dataObj.shortForecast.toLowerCase() === "areas of drizzle")
        return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "patchy drizzle")
        return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "slight chance light rain")
        return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "slight chance rain showers")
        return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "chance rain showers")
        return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "scattered rain showers")
        return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "chance light rain")
        return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "light rain likely")
        return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "light rain")
        return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase() === "chance showers")
        return "fas fa-cloud-sun-rain"
      if (dataObj.shortForecast.toLowerCase() === "showers")
        return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase() === "rain showers likely")
        return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase() === "rain showers")
        return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase() === "chance rain")
        return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase() === "rain likely")
        return "fas fa-cloud-showers-heavy"
      if (dataObj.shortForecast.toLowerCase() === "rain")
        return "fas fa-cloud-showers-heavy"
      if (dataObj.shortForecast.toLowerCase() === "heavy rain")
        return "fas fa-cloud-showers-heavy"
    } else if (dataObj.date.isDaytime === "false") {
      // nighttime
      if (dataObj.shortForecast.toLowerCase() === "clear") return "fas fa-moon"
      if (dataObj.shortForecast.toLowerCase() === "mostly clear")
        return "fas fa-moon"
      if (dataObj.shortForecast.toLowerCase() === "partly clear")
        return "fas fa-cloud-moon"
      if (dataObj.shortForecast.toLowerCase() === "partly cloudy")
        return "fas fa-cloud-moon"
      if (dataObj.shortForecast.toLowerCase() === "mostly cloudy")
        return "fas fa-cloud"
      if (dataObj.shortForecast.toLowerCase() === "cloudy")
        return "fas fa-cloud"
      if (dataObj.shortForecast.toLowerCase() === "areas of drizzle")
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase() === "patchy drizzle")
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase() === "slight chance light rain")
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase() === "slight chance rain showers")
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase() === "chance rain showers")
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase() === "scattered rain showers")
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase() === "chance light rain")
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase() === "light rain likely")
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase() === "light rain")
        return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase() === "chance showers")
        return "fas fa-cloud-moon-rain"
      if (dataObj.shortForecast.toLowerCase() === "showers")
        return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase() === "rain showers likely")
        return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase() === "rain showers")
        return "fas fa-cloud-rain"
      if (dataObj.shortForecast.toLowerCase() === "chance rain")
        return "fas fa-cloud-showers-heavy"
      if (dataObj.shortForecast.toLowerCase() === "rain likely")
        return "fas fa-cloud-showers-heavy"
      if (dataObj.shortForecast.toLowerCase() === "rain")
        return "fas fa-cloud-showers-heavy"
      if (dataObj.shortForecast.toLowerCase() === "heavy rain")
        return "fas fa-cloud-showers-heavy"
    }
    // fallback
    return "fas fa-rainbow"
  }

  function getBgImg() {
    var string
    var conditions

    if (getSpecialOccasion()) {
      string = getSpecialOccasion()
    } else {
      conditions = dataObj.shortForecastForBg.replace(/\s/g, "").toLowerCase()
      string = `${dataObj.date.season}-${conditions}-${dataObj.date.currentTimePeriod}`.toLowerCase()
    }
    console.log(string)
    return string
  }

  function getSpecialOccasion() {
    var conditions = dataObj.shortForecastForBg.replace(/\s/g, "").toLowerCase()
    // Check for pride weekend
    if (dataObj.date.month.toLowerCase() == "june") {
      if (
        (dataObj.date.dayOfWeek.toLowerCase() == "friday" &&
          dataObj.date.todaysDate > 21) ||
        (dataObj.date.dayOfWeek.toLowerCase() == "saturday" &&
          dataObj.date.todaysDate > 22) ||
        (dataObj.date.dayOfWeek.toLowerCase() == "sunday" &&
          dataObj.date.todaysDate > 23)
      ) {
        return `special/pride-${conditions}-${dataObj.date.currentTimePeriod}`.toLowerCase()
      }
    }

    return false
  }

  function tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1) // Remove full string match value
      time[5] = +time[0] < 12 ? "am" : "pm" // Set AM/PM
      time[0] = +time[0] % 12 || 12 // Adjust hours
    }
    return time.join("") // return adjusted time or original string
  }

  function renderSunriseAndSunsetDisplay() {
    // console.log("Getting Sunrise and Sunset Display")
    var sunriseDisplay = tConvert(dataObj.astronomical.sunrise)
    var sunsetDisplay = tConvert(dataObj.astronomical.sunset)

    sunriseTime.innerHTML = `${sunriseDisplay}&nbsp;`
    sunsetTime.innerHTML = `${sunsetDisplay}`
  }

  function renderDayTimeMode() {
    // console.log("Rendering DayTime Mode")
    var whiteDisplayColor = "rgb(255, 255, 255)"

    $(todaysDate).css("color", whiteDisplayColor)
    $(dayOfWeek).css("color", whiteDisplayColor)
    $(bigForecast).css("color", whiteDisplayColor)
    $(medForecast).css("color", whiteDisplayColor)
    $(currentTemp).css("color", whiteDisplayColor)
    $(degreeSymbol).css("color", whiteDisplayColor)
    $(smallForecast).css("color", whiteDisplayColor)
    $(solarStats).children().children().css("color", whiteDisplayColor)
    $(solarStats)
      .children()
      .children()
      .children()
      .css("color", whiteDisplayColor)
    $(time).css("color", whiteDisplayColor)
    $(shortForecastDisplay).css("color", whiteDisplayColor)
    $(weatherIcon).css("color", whiteDisplayColor)
  }

  function renderNightTimeMode() {
    // console.log("Rendering NightTime Mode")
    var warmDisplayColor = "rgb(250, 230, 185)"

    $(todaysDate).css("color", warmDisplayColor)
    $(dayOfWeek).css("color", warmDisplayColor)
    $(bigForecast).css("color", warmDisplayColor)
    $(medForecast).css("color", warmDisplayColor)
    $(currentTemp).css("color", warmDisplayColor)
    $(degreeSymbol).css("color", warmDisplayColor)
    $(smallForecast).css("color", warmDisplayColor)
    $(solarStats).children().children().css("color", warmDisplayColor)
    $(solarStats)
      .children()
      .children()
      .children()
      .css("color", warmDisplayColor)
    $(time).css("color", warmDisplayColor)
    $(shortForecastDisplay).css("color", warmDisplayColor)
    $(weatherIcon).css("color", warmDisplayColor)
  }
}) // end jQuery
