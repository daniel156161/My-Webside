const startbtn = document.querySelector('#startbtn');
const resetbtn = document.querySelector('#resetbtn');
const time = document.querySelector('#time');

let secs = 0;
let start = 0;
let timer;

startbtn.addEventListener('click', () => {
  if (start == 0) {
    startbtn.innerHTML = 'Pause<br><i class="fas fa-pause"></i>'; //Pause
    timer = setInterval(() => {
      secs ++;
      //Get hour min and sec from secs
      var hour = Math.floor(secs / 3600);
      var min = Math.floor((secs - (hour * 3600)) / 60);
      var sec = secs - (hour * 3600) - (min * 60);
      //when Smaller 10 then 0
      if (sec < 10) {
        sec='0'+sec
      }
      if (min < 10) {
        min='0'+min
      }
      if (hour < 10) {
        hour='0'+hour
      }
      time.innerHTML = `${hour}:${min}:${sec}`;
    }, 1000);
    start = 1;
  } else {
    startbtn.innerHTML = 'Start<br><i class="fas fa-play"></i>'; //Play
    clearInterval(timer);
    start = 0;
  }
});

resetbtn.addEventListener('click', () => {
  clearInterval(timer);
  time.innerHTML = '00:00:00';
  secs = 0;
  startbtn.innerHTML = 'Start<br><i class="fas fa-play"></i>'; //Play
  start = 0;
});
