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
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var bgColor = "rgb(" + x + "," + y + "," + z + ")";
  document.body.style.background = bgColor;
  setTimeout(random_bg_color, 1500);
}