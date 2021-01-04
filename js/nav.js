const mq = window.matchMedia("(max-width: 500px)");
const nav = document.querySelector('nav');
const submenu = document.querySelectorAll('.submenu');
const submenu2 = document.querySelectorAll('.submenu-2');
const submenuyes = document.querySelectorAll('.submenuyes');
const submenuyes2 = document.querySelectorAll('.submenuyes2');
const icon = document.querySelector('.hamburger');

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  menu();
  window.addEventListener("orientationchange", function(event) {
    if(event.target.screen.orientation.angle == 0) {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'block';
    }
  });
}

function menu() {
  icon.addEventListener('click', function() {
    if(nav.style.display != 'block') {
      nav.style.display = 'block';
    } else {
      nav.style.display = 'none';
    }
  })
  for (let i = 0; i < submenuyes.length; i++) {
    submenuyes[i].addEventListener('click', function(e){
      submenu[i].classList.toggle('display-block');
    })
  }
  for (let i = 0; i < submenuyes2.length; i++) {
    submenuyes2[i].addEventListener('click', function(e){
      submenu2[i].classList.toggle('display-block');
    })
  }
}