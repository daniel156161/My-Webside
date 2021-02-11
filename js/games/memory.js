const gameField = document.querySelector('#game');
const myicons = []; // 'fas fa-dragon,fas fa-satellite,fas fa-satellite-dish,fas fa-meteor,fas fa-toilet-paper,fas fa-gem,fas fa-space-shuttle,fas fa-user-astronaut'
const icons = [];
//Data-boxs
const databoxs = gameField.querySelectorAll('.data-box');
//Time
const gametime = gameField.querySelector('#time');
let playTime = 0;
//Score
const scoreitem = gameField.querySelector('#score');
//Game Items
const cards = gameField.querySelector('#main').querySelectorAll('div');
let itemCloseTime = 2000;
//Stats
const itemopen = [];
let isrunning = false;
let stopgame = 0;
let trys = 0;
let pageLoaded = 0;
let gameLoaded = 0;
let time;
//LocalStorage
const localKey = 'Memory';
//Game Data
const Game = {
  "Level": 1,
  "Score": 0,
  "Time": 0,
  "Switch": {
    "Score": 0,
    "Time": 0
  },
  addLevel: function() {
    this.Level ++;
  },
  addTime: function() {
    this.Time ++;
  },
  addScore: function() {
    this.Score ++;
  },
  setScoreSwitch: function() {
    if(this.Switch.Score == 3) {
      this.Switch.Score = 0;
    } else {
      this.Switch.Score ++;
    }
  },
  setTimeSwitch: function() {
    if(this.Switch.Time == 2) {
      this.Switch.Time = 0;
    } else {
      this.Switch.Time ++;
    }
  }
}
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
//Reset Button
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
  localObject.set(localKey, Game);
  isrunning = false;
  playTime = 0;
  stopgame = 0;
  gameLoaded = 0;
  trys = 0;
  Game.Score = (Game.Level-1)*8;
  outTime();
  outScore();
  makeIconArray();
  for(databox of databoxs) {
    databox.classList.replace(databox.classList[0], databoxcolor());
  }
  pause.innerHTML = '<i class="fas fa-play"></i>';
}
//Pause Button
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
//Score Button und Info
scoreitem.addEventListener('click', () => {
  Game.setScoreSwitch();
  localObject.set(localKey, Game);
  outScore();
});
//Time Button und Info
gametime.addEventListener('click', () => {
  Game.setTimeSwitch();
  localObject.set(localKey, Game);
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
  switch (Game.Switch.Score) {
    case 0:
      if(isrunning == false) {
        scoreitem.innerHTML = `Level: ${Game.Level-1}<br>Score: ${Game.Score}<br>Trys: ${trys}`;
      } else {
        scoreitem.innerHTML = `Level: ${Game.Level}<br>Score: ${Game.Score}<br>Trys: ${trys}`;
      }
      break;
    case 1:
      if(isrunning == false) {
        scoreitem.innerHTML = `Level: ${Game.Level-1}`;
      } else {
        scoreitem.innerHTML = `Level: ${Game.Level}`;
      }
      break;
    case 2:
      scoreitem.innerHTML = `Score: ${Game.Score}`;
      break;
    default:
      scoreitem.innerHTML = `Trys: ${trys}`;
  }
}
function gamestart() {
  if(isrunning == false) {
    pause.innerHTML = '<i class="fas fa-pause"></i>';
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
  //Better Timer look
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
  switch (Game.Switch.Time) {
    case 0:
      if(isrunning == false && gameLoaded == 1) {
        gametime.innerHTML = 'Pause';
      } else {
        gametime.innerHTML = `Time: ${toHHMMSS(playTime)}<br>Played: ${toHHMMSS(Game.Time)}`;
      }
      break;
    case 1:
      if(isrunning == false && gameLoaded == 1) {
        gametime.innerHTML = `Time: ${toHHMMSS(playTime)}<br>Pause`;
      } else {
        gametime.innerHTML = `Time: ${toHHMMSS(playTime)}`;
      }
      break
    case 2:
      if(isrunning == false && gameLoaded == 1) {
        gametime.innerHTML = `Played: ${toHHMMSS(Game.Time)}<br>Pause`;
      } else {
        gametime.innerHTML = `Played: ${toHHMMSS(Game.Time)}`;
      }
      break;
    default:
      Game.Switch.Time = 0;
  }
}
function myTimeer() {
  Game.addTime();
  playTime ++;
  outTime();
  if(stopgame != 8) {
    if(isrunning == false) {
      clearInterval(time);
      outTime();
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
      //Check Item Classes
      if(itemopen.length == 2) {
        trys++;
        outScore();
        if(itemopen[0].firstChild.classList[1] === itemopen[1].firstChild.classList[1]) {
          Game.addScore();
          stopgame++;
          outScore();
          //Remove Items from Check list
          for(let i = 0; i < 2; i++) {
            item = itemopen.splice(0,1)[0];
            item.classList.replace(item.classList[1], 'match');
          }
          if (stopgame == 8) {
            //Level Done
            myMusic = new sound("../../sounds/Memory/game-win-sound-effect.mp3")
            myMusic.play();
            clearInterval(time);
            isrunning = false;
            navigator.clipboard.writeText(`Level: ${Game.Level} | Trys: ${trys} | Score: ${Game.Score} | Time: ${toHHMMSS(playTime)}`);
            itemCloseTime = itemCloseTime - 100;
            if(itemCloseTime == 0) {
              itemCloseTime = 100;
              for(databox of databoxs) {
                databox.classList.replace(databox.classList[0], databoxcolor());
              }
            }
            localObject.set(localKey, Game);
            gameField.classList.add('hidden');
            msgs(`<div><h2>You Win</h2><p>Played Time: ${toHHMMSS(Game.Time)}<br>Time: ${toHHMMSS(playTime)}<br>Level: ${Game.Level}<br>Score: ${Game.Score}<br>Trys: ${trys}</p><p>Play again?</p><i class="fas fa-play"></i></div>`);
            Game.addLevel();
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
    gameField.classList.remove(gameField.classList[0]);
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
Local Storage [SAVE, LOAD]
***************************************************************************************************************/
function localLoadGameData() {
  if (localStorage.length != 0) {
    const localOut = localObject.get(localKey);
    if(localOut != null) {
      Game.Level = localOut.Level;
      Game.Time = localOut.Time;
      Game.Switch.Score = localOut.Switch.Score;
      Game.Switch.Time = localOut.Switch.Time;
      Game.Score = (localOut.Level-1)*8;
      outTime();
      outScore();
      for (let i = 0; i < Game.Level; i++) {
        itemCloseTime = itemCloseTime - 100;
        if(itemCloseTime == 0) {
          itemCloseTime = 100;
          for(databox of databoxs) {
            databox.classList.replace(databox.classList[0], databoxcolor());
          }
        }
      }
    }
  }
}
let localObject = {
  set: function(key, Object) {
    if (typeof key == 'string') {
      localStorage.setItem(key, JSON.stringify(Object));
    } else {
      console.log('Key is not a String');
    }
  },
  get: function(key) {
    if (typeof key == 'string') {
      var item = localStorage.getItem(key);
      if (item != null) {
        item = JSON.parse(localStorage.getItem(key));
      } else {
        item = undefined;
      }
      return item;
    }
  }
}
/***************************************************************************************************************
Page Load run Function
***************************************************************************************************************/
localLoadGameData()
/***************************************************************************************************************
Test Functions!!!! [replaceIcons]
***************************************************************************************************************/
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