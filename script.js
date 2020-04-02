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
const todaysDate = document.getElementById("todayDate")
const time = document.getElementById("time")
// const currentTemp = document.getElementById("currentTemp")
// const currentCond = document.getElementById("currentCond")
// const forecast = document.getElementById("forecast")

setInterval(function() {
  const date = new Date()
  dayOfWeek.innerText = dayNames[date.getDay()]
  todaysDate.innerText = `${
    monthNames[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`
  time.innerText = date.toLocaleTimeString().match(/[0-9]+[:][0-9]+/g)

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

  console.log(img)

  document.body.style.backgroundImage = `url("img/${img}.jpg")`
}, 500)
