const game = document.querySelector('#game');
const myicons = []; // 'fas fa-dragon','fas fa-cookie','fas fa-paw','fas fa-feather','fas fa-toilet-paper', 'fas fa-gem'
const icons = [];
//Data-boxs
const databoxs = document.querySelectorAll('.data-box');
const hardcorecolor = '#21518F';
//Time
const gametime = document.querySelector('#time');
let playTime = 0;
//Score
const scoreitem = document.querySelector('#score');
let scoreswitch = 0;
//Game Items
const fields = document.querySelector('#main').querySelectorAll('div');
const gamerun = window.getComputedStyle(gametime).backgroundColor;
const gamepause = '#E23D2F';
let itemCloseTime = 2000;
//Stats
const itemopen = [];
let isrunning = false;
let stopgame = 0;
let score = 0;
let pageLoaded = 0;
//Cookie
let level;
let gameTime = undefined;
/***************************************************************************************************************
Icons Json ( Random Icons --> myicons = [8x] )
***************************************************************************************************************/
fetch("../../json/FontAwesome_Icons.json")
  .then(response => response.json())
  .then(json => makeIconFromJson(json));

function makeIconFromJson(json) {
  for (let i = 0; i < 8; i++) {
    myicons.push(`fas fa-${json.Icons.solid.splice(Math.floor(Math.random() * (json.Icons.solid.length)), 1)[0]}`);
  }
  makeIconArray();
}
/***************************************************************************************************************
Icons ( myicons = [8x] --> icons = [16x] )
***************************************************************************************************************/
function makeIconArray() {
  for (let i = 0; i < 2; i++) {
    for(newicons of myicons) {
      icons.push(newicons);
    }
  }
  shuffleItems();
}
/***************************************************************************************************************
Buttons [start] [pause] [scoreswitch]
***************************************************************************************************************/
const start = document.querySelector('#start').addEventListener('click', gamestart);
const pause = document.querySelector('#pause').addEventListener('click', function(){
  isrunning = false;
  if(itemopen) {
    for(item of itemopen) {
      item.firstChild.style.display = 'none';
    }
  }
});
scoreitem.addEventListener('click', function(){
  if(scoreswitch == 2) {
    scoreswitch = 0;
  } else {
    scoreswitch ++;
  }
  outScore();
});
/***************************************************************************************************************
Start Game [shuffleItems] [outScore] [gamestart]
***************************************************************************************************************/
let time;
function shuffleItems() {
  for(field of fields) {
    field.innerHTML = '<i class="' + icons.splice(Math.floor(Math.random() * (icons.length)), 1)[0] + '"></i>';
    field.firstChild.style.display = 'none';
  }
}
function outScore() {
  switch (scoreswitch) {
    case 0:
      scoreitem.innerHTML = 'Level: ' + level + '<br>' + 'Score: ' + score;
      break;
    case 1:
      scoreitem.innerHTML = 'Level: ' + level;
      break;
    default:
      scoreitem.innerHTML = 'Score: ' + score;
  }
}
function gamestart() {
  if(isrunning == false) {
    if(stopgame == 8) {
      playTime = 0;
      stopgame = 0;
      pageLoaded = 0;
      outTime();
      for(field of fields) {
        field.classList.remove('match');
        field.classList.remove('open');
        //Remove old Icon
        field.firstChild.classList.remove(field.firstChild.classList[1]);
      }
      makeIconArray();
    }
    isrunning = true;
    time = setInterval(myTimeer, 1000)
    outScore();
    if(itemopen) {
      for(item of itemopen) {
        item.firstChild.style.display = 'block';
      }
    }
  }
}
/***************************************************************************************************************
Game Time Played [toHHMMSS] [Level Time, Full Time]
***************************************************************************************************************/
function toHHMMSS(sec) {
  var sec_num = parseInt(sec, 10);
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  if (hours == '00') {
    return minutes + ':' + seconds;
  } else {
    return hours + ':' + minutes + ':' + seconds;
  }
}
/***************************************************************************************************************
Timer [outTime] [myTimeer]
***************************************************************************************************************/
function outTime() {
  switch (isrunning) {
    case false:
      gametime.innerHTML = 'Time: ' + toHHMMSS(playTime) + '<br>Pause';
      if (pageLoaded  == 0) {
        gametime.innerHTML = 'Time: ' + toHHMMSS(playTime) + '<br>Played: ' + toHHMMSS(gameTime);
        pageLoaded = 1;
      }
      break;
    case true:
      gametime.innerHTML = 'Time: ' + toHHMMSS(playTime) + '<br>Played: ' + toHHMMSS(gameTime);
      break;
  }
}
function myTimeer() {
  gameTime ++;
  playTime ++;
  outTime();
  if(itemCloseTime == 100) {
    for(databox of databoxs) {
      databox.style.backgroundColor = hardcorecolor;
    }
  } else {
    gametime.style.backgroundColor = gamerun;
  }
  if(stopgame != 8) {
    if(isrunning == false) {
      clearInterval(time);
      outTime();
      gametime.style.backgroundColor = gamepause;
    }
  } else {
    //Level Done
    clearInterval(time);
    isrunning = false;
    navigator.clipboard.writeText('Level: ' + level + ' | Score: ' + score + ' | Time: ' + toHHMMSS(playTime));
    itemCloseTime = itemCloseTime - 100;
    if(itemCloseTime == 0) {
      itemCloseTime = 100;
      for(databox of databoxs) {
        databox.style.backgroundColor = hardcorecolor;
      }
    }
    setCookie(cookiename, `${level},${gameTime}`, cookieexdays);
    setCookie(cookienamegametime, gameTime, 365);
    level++;
  }
}
/***************************************************************************************************************
Game Items
***************************************************************************************************************/
for(field of fields){
  field.addEventListener('click', function(e) {
    gamestart();
    if (e.target.classList[1] != 'open' && e.target.classList[1] != 'match' && e.target.style.display != 'block' && itemopen.length < 2) {
      //Show Item and add to Itemopen Array
      if(e.target.firstChild) {
        e.target.firstChild.style.display = 'block';
        e.target.classList.add('open');
        itemopen.push(e.target);
      } else {
        e.target.style.display = 'block';
        e.target.parentElement.classList.add('open');
        itemopen.push(e.target.parentElement);
      }
      //Check Item Classes
      checkItems();
    }
  })
}
function checkItems() {
  if(itemopen.length == 2){
    if(itemopen[0].firstChild.classList[1] === itemopen[1].firstChild.classList[1]) {
      score++;
      stopgame++;
      outScore();
      //Remove Items from Check list
      for(let i = 0; i < 2; i++) {
        item = itemopen.splice(0,1)[0];
        item.classList.remove('open');
        item.classList.add('match');
      }
    } else {
      //Close Items
      setTimeout(function () {
        for (let i = 0; i < 2; i++) {
          item = itemopen.splice(0,1)[0];
          item.firstChild.style.display = 'none';
          item.classList.remove('open');
        }
      }, itemCloseTime);
    }
  }
}
/***************************************************************************************************************
Cookie [SET, GET, Check, Reset]
***************************************************************************************************************/
const cookiename = 'Memory - daniel156161';
const cookienamegametime = 'Memory [GameTime] - daniel156161';
const cookieexdays = 14;
getGamedataFromCookie();

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ';SameSite=None; Secure';
}
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function checkCookie(cname) {
  const cookieval=getCookie(cname);
  if (cookieval != "" && cookieval != "undefined") {
    var cookiearray = cookieval.split(',');
  }
  return cookiearray
}
function resetCookie() {
  setCookie(cookiename);
  location.reload();
  return true;
}
/***************************************************************************************************************
Cookie [getGameDataFromCookie] Data from Cookie to right Variables
***************************************************************************************************************/
function getGamedataFromCookie() {
  const data = checkCookie(cookiename);
  if (data != "" && data != undefined) {
    level = data[0];
    gameTime = data[1];
    if (gameTime != "" || gameTime != undefined) {
      gameTime = getCookie(cookienamegametime);
    } else {
      gameTime = 0;
    }
    score = level * 8;
    if(level == 'null') {
      level = 1;
      score = 0;
    }
    if(itemCloseTime == undefined) {
      itemCloseTime = 2000;
    } else {
      for (let i = 0; i < level; i++) {
        itemCloseTime = itemCloseTime - 100;
        if(itemCloseTime == 0) {
          itemCloseTime = 100;
          for(databox of databoxs) {
            databox.style.backgroundColor = hardcorecolor;
          }
        }
      }
    }
    outTime();
    outScore();
    if(score != 0) {
      level++;
    }
  } else {
    level = 1;
    score = 0;
    itemCloseTime = 2000;
    if (gameTime != "" || gameTime != undefined) {
      gameTime = getCookie(cookienamegametime);
    } else {
      gameTime = 0;
    }
  }
}
/***************************************************************************************************************
Cookie [LOAD, SAVE]
***************************************************************************************************************/
gametime.addEventListener('click', function () {
  saveCookie();
});

function saveCookie() {
  if(getCookie(cookiename) != 'null') {
    cookieval = prompt("Please enter your Level:", `${getCookie(cookiename).split(',')[0]}`);
  } else {
    cookieval = prompt("Please enter your Level:", "");
  }
  setCookie(cookiename, `${cookieval},${gameTime}`, cookieexdays);
  location.reload(); 
}
/***************************************************************************************************************
Phone Screen Orientation
***************************************************************************************************************/
const databoxcsssize = window.getComputedStyle(databoxs[0]).fontSize;
const fieldcsssize = window.getComputedStyle(fields[0]).fontSize;
const footer = document.querySelector('footer');
const GamePaddingBottom = window.getComputedStyle(game).paddingBottom;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  //On load
  if (window.screen.orientation.angle == 0) {
    portraitScreenOrientation();
  } else {
    landscapeScreenOrientation();
  }
  //Screen Orientation Changing
  window.addEventListener("orientationchange", function(e) {
    if(e.target.screen.orientation.angle == 0) {
      portraitScreenOrientation();
    } else {
      landscapeScreenOrientation();
    }
  });
}
//Screen 0°
function portraitScreenOrientation() {
  for(databox of databoxs) {
    databox.style.fontSize = '2em';
  }
  for(field of fields) {
    field.style.fontSize = fieldcsssize;
  }
  footer.style.display = 'block';
  game.style.paddingBottom = GamePaddingBottom;
}
//Screen 90°
function landscapeScreenOrientation() {
  for(databox of databoxs) {
    databox.style.fontSize = '1em';
  }
  for(field of fields) {
    field.style.fontSize = '0.5em';
  }
  footer.style.display = 'none';
  game.style.paddingBottom = '0';
}