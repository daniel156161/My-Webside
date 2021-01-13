const msg = document.querySelector("#msg");

const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1;

//My Birthday
if (day === 16 && month === 9) {
  msg.innerHTML = 'Happy Birthday to my Self';
}
//Christmas
if(day === 24 && month === 12) {
  msg.innerHTML = 'Wish you all Marry Christmas';
}
//New Year
if(day === 31 && month === 12) {
  msg.innerHTML = `Happy new Year ${currentDate.getFullYear() + 1}`
}
//My Age or Normal msg
if(msg.innerHTML === 'A <strong>responsive</strong> website created by me.'){
  const rn = Math.floor(Math.random() * 3);
  if(rn == 1) {
    setInterval(() => {
      const time = (new Date() - new Date(874411200000)) / (1000 * 60 * 60 * 24 * 365.25); // milliseconds per year
      const agetime = time.toString().substring(0, 12);
      msg.innerHTML = `I'm a ${agetime} year-old developer`;
    }, 50);
  } else if (rn == 2) {
    setInterval(() => {
      const time = new Date()
      let hour = time.getHours()
      let min = time.getMinutes()
      let sec = time.getSeconds()
      if (hour < 10) {  hour = '0' + hour; }
      if (min < 10)  {  min = '0' + min;   }
      if (sec < 10)  {  sec = '0' + sec;   }
      msg.innerHTML = `Your Time is ${hour}:${min}:${sec} now` 
    }, 1000);
  }
}