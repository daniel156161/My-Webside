const mq = window.matchMedia("(max-width: 574px)");
const nav = document.querySelector('nav');
const submenu = document.querySelectorAll('.submenu');
const submenu2 = document.querySelectorAll('.submenu-2');
const submenuyes = document.querySelectorAll('.submenuyes');
const submenuyes2 = document.querySelectorAll('.submenuyes2');
const icon = document.querySelector('.hamburger');
let navswitch = 0;

menu();
//Small view for Phone
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  window.addEventListener("orientationchange", function(event) {
    if(event.target.screen.orientation.angle == 0) {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'block';
    }
  });
}
//Function
function menu() {
  icon.addEventListener('click', function() {
    if(nav.style.display != 'block') {
      nav.style.display = 'block';
    } else {
      nav.style.display = 'none';
    }
  })
  for (let i = 0; i < submenuyes.length; i++) {
    submenuyes[i].addEventListener('click', function(){
      submenu[i].classList.toggle('display-block');
    })
  }
  for (let i = 0; i < submenuyes2.length; i++) {
    submenuyes2[i].addEventListener('click', function(){
      submenu2[i].classList.toggle('display-block');
    })
  }
}
/**************************************************************************************
Copyright
**************************************************************************************/
const copyright = document.querySelector('#copyright')

copyright.innerHTML = '2020 - ' + new Date().getFullYear();
/**************************************************************************************
Fun / Ascii Art
**************************************************************************************/
console.log(navigator.userAgent);
if (navigator.oscpu == 'Linux x86_64') {
  console.log(`%c   /$$       /$$                              
  | $$      |__/                              
  | $$       /$$ /$$$$$$$  /$$   /$$ /$$   /$$
  | $$      | $$| $$__  $$| $$  | $$|  $$ /$$/
  | $$      | $$| $$  \ $$| $$  | $$ \  $$$$/ 
  | $$      | $$| $$  | $$| $$  | $$  >$$  $$ 
  | $$$$$$$$| $$| $$  | $$|  $$$$$$/ /$$/\  $$
  |________/|__/|__/  |__/ \______/ |__/  \__/`, 'font-family:monospace')
} else {
  console.log('...');
}
console.log(`%c                                                                   ,-,
                                                             _.-=;~ /_
                                                          _-~   '     ;.
                                                      _.-~     '   .-~-~\`-._
                                                _.--~~:.             --.____88
                              ____.........--~~~. .' .  .        _..-------~~
                     _..--~~~~               .' .'             ,'
                 _.-~                        .       .     \` ,'
               .'                                    :.    ./
             .:     ,/          \`                   ::.   ,'
           .:'     ,(            ;.                ::. ,-'
          .'     ./'.\`.     . . /:::._______.... _/:.o/
         /     ./'. . .)  . _.,'               \`88;?88|
       ,'  . .,/'._,-~ /_.o8P'                  88P ?8b
    _,'' . .,/',-~    d888P'                    88'  88|
 _.'~  . .,:oP'        ?88b              _..--- 88.--'8b.--..__
:     ...' 88o __,------.88o ...__..._.=~- .    \`~~   \`~~      ~-._ Seal _.
\`.;;;:='    ~~            ~~~                ~-    -       -   -

The fox goes "Yip Yip!"

`, 'font-family:monospace');