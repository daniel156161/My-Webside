const game = document.querySelector('#game');
const myicons = []; // 'fas fa-dragon,fas fa-satellite,fas fa-satellite-dish,fas fa-meteor,fas fa-toilet-paper,fas fa-gem,fas fa-space-shuttle,fas fa-user-astronaut'
const icons = [];
//Data-boxs
const databoxs = game.querySelectorAll('.data-box');
//Time
const gametime = game.querySelector('#time');
let playTime = 0;
//Score
const scoreitem = game.querySelector('#score');
//Game Items
const cards = game.querySelector('#main').querySelectorAll('div');
let itemCloseTime = 2000;
//Stats
const itemopen = [];
let isrunning = false;
let stopgame = 0;
let score = 0;
let trys = 0;
let pageLoaded = 0;
let gameLoaded = 0;
let time;
//Cookie
let level;
let gameTime = undefined;
let scoreswitch = undefined;
let timerswitch = undefined;
/***************************************************************************************************************
Icons Json ( Random Icons --> icons = [16x] )
***************************************************************************************************************/
fetch("../../json/FontAwesome_Icons.json")
  .then(response => response.json())
  .then(json => makeIconFromJson(json));

function makeIconFromJson(json) {
  let savedicons = myicons.length;
  //Random Icons --> myicons = [8x]
  for (let i = 0; i < 8 - savedicons; i++) {
    myicons.push(`fas fa-${json.Icons.solid.splice(Math.floor(Math.random() * (json.Icons.solid.length)), 1)[0]}`);
  }
  for (card of cards) {
    cardAddEventListener(card);
  }
}
//myicons = [8x] --> icons = [16x]
function makeIconArray() {
  for (let i = 0; i < 2; i++) {
    for(newicons of myicons) {
      icons.push(newicons);
    }
  }
  shuffleItems();
}
/***************************************************************************************************************
Buttons [reset, pause, scoreswitch, timerswitch]
***************************************************************************************************************/
const restart = document.querySelector('#restart').addEventListener('click', resetGame);
function resetGame() {
  for(card of cards) {
    if(card.classList[1] != 'hover') {
      card.classList.replace(card.classList[1], 'hover');
    }
  }
  for (let i = 0; i < 2; i++) {
    itemopen.splice(0,1)[0];
  }
  clearInterval(time);
  setCookie(cookiename, `${level-1},${gameTime},${scoreswitch},${timerswitch}`, cookieexdays);
  setCookie(cookienamegametime, gameTime, 365);
  isrunning = false;
  playTime = 0;
  stopgame = 0;
  gameLoaded = 0;
  trys = 0;
  score = (level-1)*8;
  /*backgroundMusic = 0;
  myMusic.stop()*/
  outTime();
  outScore();
  makeIconArray();
  for(databox of databoxs) {
    databox.classList.replace(databox.classList[0], databoxcolor());
  }
}
const pause = document.querySelector('#pause');
pause.addEventListener('click', () => {
  if (isrunning == true) {
    isrunning = false;
    if(itemopen) {
      for(item of itemopen) {
        item.classList.remove('opened');
        item.classList.add('pause');
      }
    }
    pause.innerHTML = '<i class="fas fa-play"></i>';
  } else {
    pause.innerHTML = '<i class="fas fa-pause"></i>';
    gamestart();
  }
});
scoreitem.addEventListener('click', () => {
  if(scoreswitch == 3) {
    scoreswitch = 0;
  } else {
    scoreswitch ++;
  }
  setCookie(cookiename, `${level-1},${gameTime},${scoreswitch},${timerswitch}`, cookieexdays);
  outScore();
});
gametime.addEventListener('click', () => {
  if(timerswitch == 2) {
    timerswitch = 0;
  } else {
    timerswitch ++;
  }
  setCookie(cookiename, `${level-1},${gameTime},${scoreswitch},${timerswitch}`, cookieexdays);
  outTime();
});
/***************************************************************************************************************
Start Game [shuffleItems, outScore, gamestart]
***************************************************************************************************************/
function shuffleItems() {
  for(card of cards) {
    card.innerHTML = `<i class="${icons.splice(Math.floor(Math.random() * (icons.length)), 1)[0]}"></i>`;
  }
}
function outScore() {
  switch (scoreswitch) {
    case 0:
      if(isrunning == false) {
        scoreitem.innerHTML = `Level: ${level-1}<br>Score: ${score}<br>Trys: ${trys}`;
      } else {
        scoreitem.innerHTML = `Level: ${level}<br>Score: ${score}<br>Trys: ${trys}`;
      }
      break;
    case 1:
      if(isrunning == false) {
        scoreitem.innerHTML = `Level: ${level-1}`;
      } else {
        scoreitem.innerHTML = `Level: ${level}`;
      }
      break;
    case 2:
      scoreitem.innerHTML = `Score: ${score}`;
      break;
    default:
      scoreitem.innerHTML = `Trys: ${trys}`;
  }
}
function gamestart() {
  if(isrunning == false) {
    if(stopgame == 8) {
      playTime = 0;
      stopgame = 0;
      gameLoaded = 0;
      trys = 0;
      outTime();
      for(card of cards) {
        card.classList.replace(card.classList[1], 'hover');
        //Remove old Icon
        card.firstChild.classList.remove(card.firstChild.classList[1]);
      }
      makeIconArray();
    }
    isrunning = true;
    gameLoaded = 1;
    time = setInterval(myTimeer, 1000);
    outScore();
    if(itemopen) {
      for(item of itemopen) {
        item.classList.add('opened');
        item.classList.remove('pause');
      }
    }
    /*myMusic = new sound("../../sounds/Memory/POL-galactic-trek-short.wav");
    myMusic.play();*/
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
Timer [outTime, myTimeer]
***************************************************************************************************************/
function outTime() {
  switch (timerswitch) {
    case 0:
      if(isrunning == false && gameLoaded == 1) {
        gametime.innerHTML = 'Pause';
      } else {
        gametime.innerHTML = `Time: ${toHHMMSS(playTime)}<br>Played: ${toHHMMSS(gameTime)}`;
      }
      break;
    case 1:
      if(isrunning == false && gameLoaded == 1) {
        gametime.innerHTML = `Time: ${toHHMMSS(playTime)}<br>Pause`;
      } else {
        gametime.innerHTML = `Time: ${toHHMMSS(playTime)}`
      }
      break
    case 2:
      if(isrunning == false && gameLoaded == 1) {
        gametime.innerHTML = `Played: ${toHHMMSS(gameTime)}<br>Pause`;
      } else {
        gametime.innerHTML = `Played: ${toHHMMSS(gameTime)}`
      }
      break;
    default:
      timerswitch = 0;
  }
}
function myTimeer() {
  /*if(backgroundMusic == 12) {
    myMusic = new sound("../../sounds/Memory/POL-galactic-trek-short.wav");
    myMusic.play();
    backgroundMusic = 0;
  }
  backgroundMusic ++;*/
  gameTime ++;
  playTime ++;
  outTime();
  if(stopgame != 8) {
    if(isrunning == false) {
      clearInterval(time);
      outTime();
      /*myMusic.stop()
      backgroundMusic = 1;*/
    }
  }
  for(databox of databoxs) {
    databox.classList.replace(databox.classList[0], databoxcolor());
  }
}
function databoxcolor() {
  if (isrunning == false){
    var databoxclass = 'data-box-pause';
    if(itemCloseTime != 100 && gameLoaded == 0) {
      var databoxclass = 'data-box';
    }
    if(itemCloseTime == 100 && gameLoaded == 0) {
      var databoxclass = 'data-box-hardcore';
    }
  } else if (isrunning == true) {
    var databoxclass = 'data-box';
    if(itemCloseTime == 100) {
      var databoxclass = 'data-box-hardcore';
    }
  }
  return databoxclass;
}
/***************************************************************************************************************
Game Items
***************************************************************************************************************/
function cardAddEventListener(c) {
  c.addEventListener('click', e=> {
    gamestart();
    if (e.currentTarget.classList[1] == 'hover' && itemopen.length < 2) {
      //Show Item and add to Itemopen Array
      e.currentTarget.classList.replace(e.currentTarget.classList[1], 'opened');
      itemopen.push(e.currentTarget);
      setCookie(cookiename, `${level-1},${gameTime},${scoreswitch},${timerswitch}`, cookieexdays);
      //Check Item Classes
      if(itemopen.length == 2){
        trys++;
        outScore();
        if(itemopen[0].firstChild.classList[1] === itemopen[1].firstChild.classList[1]) {
          score++;
          stopgame++;
          outScore();
          //Remove Items from Check list
          for(let i = 0; i < 2; i++) {
            item = itemopen.splice(0,1)[0];
            item.classList.replace(item.classList[1], 'match');
          }
          if (stopgame == 8) {
            //Level Done
            //myMusic.stop()
            myMusic = new sound("../../sounds/Memory/game-win-sound-effect.mp3")
            myMusic.play();
            clearInterval(time);
            isrunning = false;
            navigator.clipboard.writeText(`Level: ${level} | Trys: ${trys} | Score: ${score} | Time: ${toHHMMSS(playTime)}`);
            itemCloseTime = itemCloseTime - 100;
            if(itemCloseTime == 0) {
              itemCloseTime = 100;
              for(databox of databoxs) {
                databox.classList.replace(databox.classList[0], databoxcolor());
              }
            }
            setCookie(cookiename, `${level},${gameTime},${scoreswitch},${timerswitch}`, cookieexdays);
            setCookie(cookienamegametime, gameTime, 365);
            game.classList.add('hidden');
            msgs(`<div><h2>You Win</h2><p>Played Time: ${toHHMMSS(gameTime)}<br>Time: ${toHHMMSS(playTime)}<br>Level: ${level}<br>Score: ${score}<br>Trys: ${trys}</p><p>Play again?</p><i class="fas fa-play"></i></div>`);
            level++;
          }
        } else {
          //Close Items
          setTimeout(() => {
            for (let i = 0; i < 2; i++) {
              item = itemopen.splice(0,1)[0];
              item.classList.replace(item.classList[1], 'hover');
            }
          }, itemCloseTime);
        }
      }
    }
  });
}
/***************************************************************************************************************
Msg [msgs] Welcome and Win Msg
***************************************************************************************************************/
const msg = document.querySelector('#gamemsg');
msgs('<div><h2>Welcome</h2><p>Memory Coded by me</p><p>Play?</p><i class="fas fa-play"></i></div>');
function msgs(text) {
  msg.classList.remove('hidden');
  msg.innerHTML = text;
  //Play Button
  msg.addEventListener('click', () => {
    msg.classList.add('hidden');
    msg.classList.remove('win');
    game.classList.remove(game.classList[0]);
    if(pageLoaded == 1) {
      if (myMusic) {
        myMusic.stop();
      }
      resetGame();
    } else {
      pageLoaded = 1;
      makeIconArray();
    }
  });
}
/***************************************************************************************************************
Sound
***************************************************************************************************************/
var myMusic;
let backgroundMusic = 1;
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
      this.sound.play();
  }
  this.stop = function() {
      this.sound.pause();
  }
}
/***************************************************************************************************************
Cookie [SET, GET, Check]
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
  return cookiearray;
}
/***************************************************************************************************************
Cookie [getGameDataFromCookie] Data from Cookie to right Variables
***************************************************************************************************************/
function getGamedataFromCookie() {
  const data = checkCookie(cookiename);
  if (data != "" && data != undefined) {
    level = data[0];
    gameTime = data[1];
    scoreswitch = data[2];
    timerswitch = data[3];
    if (gameTime != "" || gameTime != undefined) {
      gameTime = getCookie(cookienamegametime);
    } else {
      gameTime = 0;
    }
    score = level * 8;
    if(level == 'null' || level == '0') {
      level = 1;
      score = 0;
      itemCloseTime = 2000;
    } else {
      for (let i = 0; i < level; i++) {
        itemCloseTime = itemCloseTime - 100;
        if(itemCloseTime == 0) {
          itemCloseTime = 100;
          for(databox of databoxs) {
            databox.classList.replace(databox.classList[0], databoxcolor());
          }
        }
      }
    }
    if(scoreswitch == undefined) {
      scoreswitch = 0;
    } else {
      scoreswitch = parseInt(scoreswitch, 10);
    }
    if(timerswitch == undefined) {
      timerswitch = 0;
    } else {
      timerswitch = parseInt(timerswitch, 10);
    }
    if(score != 0) {
      level++;
    }
    outTime();
    outScore();
  } else {
    level = 1;
    score = 0;
    itemCloseTime = 2000;
    scoreswitch = 0;
    timerswitch = 0;
    if (gameTime != "" || gameTime != undefined) {
      gameTime = getCookie(cookienamegametime);
    } else {
      gameTime = 0;
    }
  }
}
/***************************************************************************************************************
Cookie [SAVE, RESET] Test Functions!!!!
***************************************************************************************************************/
function saveCookie() {
  if(getCookie(cookiename) != 'null') {
    cookieval = prompt("Please enter your Level:", `${getCookie(cookiename).split(',')[0]}`);
  } else {
    cookieval = prompt("Please enter your Level:", "");
  }
  setCookie(cookiename, `${cookieval},${gameTime},${scoreswitch},${timerswitch}`, cookieexdays);
  location.reload();
}
function resetCookie() {
  setCookie(cookiename);
  location.reload();
}
function replaceIcons(Icons) {
  let Icon = Icons.split(',');
  if (Icon.length == 8) {
    for (let i = 0; i < 8; i++) {
      myicons.splice(0,1)[0];
    }
    for (let i = 0; i < 8; i++) {
      myicons.push(Icon[i]);
    }
  } else {
    return "You don't have 8 Icons or to much";
  }
}