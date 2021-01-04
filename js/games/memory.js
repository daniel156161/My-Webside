const items = document.querySelector('#game').querySelectorAll('.fas');
const icons = ['fa-air-freshener', 'fa-dragon', 'fa-cookie', 'fa-at', 'fa-bahai', 'fa-bacterium', 'fa-paw', 'fa-feather', 'fa-air-freshener', 'fa-dragon', 'fa-cookie', 'fa-at', 'fa-bahai', 'fa-bacterium', 'fa-paw', 'fa-feather'];
//Stats
let isrunning = false;
let stopgame = 0;
let score = 0;
//Time
const gametime = document.querySelector('#time');
let min = 0;
let sec = 0;
//Score
const scoreitem = document.querySelector('#score');
let scoreswitch = 0;
//Game Items
const fields = document.querySelectorAll('.iconscenter');
const itemopen = [];
const gamerun = window.getComputedStyle(gametime).backgroundColor;
const gamepause = '#E23D2F';
let itemclosetime = 2000;
//Cookie
let level;
/***************************************************************************************************************
Buttons
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
  getScore();
});
/***************************************************************************************************************
Start Game
***************************************************************************************************************/
shuffleitems();

function shuffleitems() {
  for(item of items) {
    let icon = icons.splice(Math.floor(Math.random() * (icons.length)), 1)[0];
    item.classList.add(icon);
    item.style.display = 'none';
  }
}
function getScore() {
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
      min = 0;
      sec = 0;
      stopgame = 0;
      for(field of fields) {
        field.classList.remove('correct');
        field.classList.remove('open');
        //Remove old Icon
        field.firstChild.classList.remove(field.firstChild.classList[1]);
      }
      icons.push('fa-air-freshener', 'fa-dragon', 'fa-cookie', 'fa-at', 'fa-bahai', 'fa-bacterium', 'fa-paw', 'fa-feather', 'fa-air-freshener', 'fa-dragon', 'fa-cookie', 'fa-at', 'fa-bahai', 'fa-bacterium', 'fa-paw', 'fa-feather');
      shuffleitems();
    }
    isrunning = true;
    time();
    getScore();
    if(itemopen) {
      for(item of itemopen) {
        item.firstChild.style.display = 'block';
      }
    }
  }
}
/***************************************************************************************************************
Timer
***************************************************************************************************************/
function time() {
  if(sec < 59) {
    sec ++;
  } else {
    sec = 0;
    min ++;
    if(min > 59) {
      min = 0;
    }
  }
  //Better Time look 00:00
  if(sec < 10) {
    var secsmall10 = '0';
  } else {
    var secsmall10 = '';
  }
  if(min < 10) {
    var minsmall10 = '0';
  } else {
    var minsmall10 = '';
  }
  gametime.innerHTML = 'Time: ' + minsmall10 + min + ":" + secsmall10 + sec;
  gametime.style.backgroundColor = gamerun;
  if(stopgame != 8) {
    if(isrunning == true) {
      setTimeout(time, 1000);
    } else {
      isrunning = false;
      gametime.innerHTML = 'Time: ' + minsmall10 + min + ':' + secsmall10 + sec + '<br>Pause';
      gametime.style.backgroundColor = gamepause;
    }
  } else {
    //Level Done
    isrunning = false;
    navigator.clipboard.writeText('Level: ' + level + ' | Score: ' + score + ' | Time: ' + minsmall10 + min + ':' + secsmall10 + sec);
    itemclosetime = itemclosetime - 100;
    if(itemclosetime == 0) {
      itemclosetime = 100;
    }
    setCookie(cookiename, `${level}`, cookieexdays);
    level++;
  }
}
/***************************************************************************************************************
Game Items
***************************************************************************************************************/
for(field of fields){
  field.addEventListener('click', function(e) {
    gamestart();
    if (e.target.classList[1] != 'open' && e.target.style.display != 'block' && itemopen.length < 2) {
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
      if(itemopen.length == 2){
        if(itemopen[0].firstChild.classList[1] === itemopen[1].firstChild.classList[1]) {
          score++;
          stopgame++;
          getScore();
          //Remove Items from Check list
          for(let i = 0; i < 2; i++) {
            item = itemopen.splice(0,1)[0];
            item.classList.add('correct');
          }
        } else {
          //Close Items
          setTimeout(function () {
            for (let i = 0; i < 2; i++) {
              item = itemopen.splice(0,1)[0];
              item.firstChild.style.display = 'none';
              item.classList.remove('open');
            }
          }, itemclosetime);
        }
      }
    }
  })
}
/***************************************************************************************************************
Cookie [SET, GET, Check]
***************************************************************************************************************/
let cookiename = 'Memory - daniel156161';
let cookieexdays = 14;
checkCookie(cookiename);

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
  var cookieval=getCookie(cname);
  if (cookieval != "" && cookieval != "undefined") {
    const cookiearray = cookieval.split(',');
    level = cookiearray[0];
    score = level * 8;
    if(level == 'null') {
      level = 1;
      score = 0;
    }
    if(itemclosetime == undefined) {
      itemclosetime = 2000;
    } else {
      for (let i = 0; i < level; i++) {
        itemclosetime = itemclosetime - 100;
        if(itemclosetime == 0) {
          itemclosetime = 100;
        }
      }
    }
    getScore();
    if(score != 0) {
      level++;
    }
  } else {
    level = 1;
    score = 0;
    itemclosetime = 2000;
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
    cookieval = prompt("Please enter your Level:", `${getCookie(cookiename)}`);
  } else {
    cookieval = prompt("Please enter your Level:", "");
  }
  setCookie(cookiename, cookieval, cookieexdays);
  location.reload(); 
}
/***************************************************************************************************************
Fun
***************************************************************************************************************/
function shufflefun() {
  for(field of fields) {
    field.firstChild.classList.remove(field.firstChild.classList[1]);
    field.classList.remove('open');
    field.firstChild.style.display = 'block';
  }
  scoreitem.innerHTML = 'Score';
  gametime.innerHTML = 'Time';
  icons.push('fa-air-freshener', 'fa-dragon', 'fa-cookie', 'fa-at', 'fa-bahai', 'fa-bacterium', 'fa-paw', 'fa-feather', 'fa-air-freshener', 'fa-dragon', 'fa-cookie', 'fa-at', 'fa-bahai', 'fa-bacterium', 'fa-paw', 'fa-feather');
  for (item of items) {
    let icon = icons.splice(Math.floor(Math.random() * (icons.length)), 1)[0];
    item.classList.add(icon);
  }
  if(isrunning == false) {
    setTimeout(shufflefun, 200);
  } else {
    shuffleitems();
    getScore();
  }
  return true;
}
/***************************************************************************************************************
Phone Screen Orientation
***************************************************************************************************************/
const databoxs = document.querySelectorAll('.data-box');
const databoxcsssize = window.getComputedStyle(databoxs[0]).fontSize;
const fieldcsssize = window.getComputedStyle(fields[0]).fontSize;

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
}
//Screen 90°
function landscapeScreenOrientation() {
  for(databox of databoxs) {
    databox.style.fontSize = '1em';
  }
  for(field of fields) {
    field.style.fontSize = '0.5em';
  }
}