//Chnage Body Background from div click
let divs = document.querySelectorAll('.clickdiv');

if(divs.length != 0) {
  for(div of divs) {
    div.addEventListener('click', function(e) {
      document.body.style.backgroundColor = window.getComputedStyle(e.target).backgroundColor;
      if (e.target.id === 'd06') {
        document.body.style.color = window.getComputedStyle(e.target).color;
      } else {
        document.body.style.color = '#000';
      }
    });
  }
} else {
  random_bg_color();
}

function random_bg_color() {
  var bgColor = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
  document.body.style.background = bgColor;
  setTimeout(random_bg_color, 1500);
}