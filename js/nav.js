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