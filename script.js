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
}, 500)

// const date = new Date()

// dayOfWeek.innerText = dayNames[date.getDay()]
// todaysDate.innerText = `${
//   monthNames[date.getMonth()]
// } ${date.getDate()}, ${date.getFullYear()}`
// time.innerText = date.toLocaleTimeString().match(/[0-9]+[:][0-9]+/g)
