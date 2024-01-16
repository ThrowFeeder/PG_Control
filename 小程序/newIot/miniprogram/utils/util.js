
const formatTime = date => {
  // const year = date.getFullYear()
  // const month = date.getMonth() + 1
  // const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  
  // [year, month, day].map(formatNumber).join('/') + ' ' +

  return  [hour, minute, second].map(formatNumber).join(':')
}
function getTimes(date){
  this.formatTime(date)
  let hour = parseInt(date.getHours())
  let minute = parseInt(date.getMinutes())
  let second = parseInt(date.getSeconds())
  const times = []
  for(let i = 0; i < 10; i++){
    second+=2
    if(second == 60){
      second = 0;
      minute++;
    }
    if(minute == 60){
      minute = 0;
      hour++;
    }
    if(hour == 24) hour = 0
    times.push(`${hour < 10 ? '0'+hour : hour}:${minute < 10 ? '0'+minute : minute}:${ second < 10 ? '0'+second : second}`)
  }
  return times
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


module.exports = {
  formatTime: formatTime,getTimes
}
