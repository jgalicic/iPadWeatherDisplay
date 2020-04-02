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
  const img = "img-1"
  if (date.getMinutes() >= 0 && date.getMinutes() < 10) img = "img-1"
  if (date.getMinutes() >= 10 && date.getMinutes() < 20) img = "img-2"
  if (date.getMinutes() >= 20 && date.getMinutes() < 30) img = "img-3"
  if (date.getMinutes() >= 30 && date.getMinutes() < 40) img = "img-4"
  if (date.getMinutes() >= 40 && date.getMinutes() < 50) img = "img-5"
  if (date.getMinutes() >= 50 && date.getMinutes() < 61) img = "img-6"

  document.body.style.backgroundImage = `url("img/${img}.jpg")`
}, 500)
