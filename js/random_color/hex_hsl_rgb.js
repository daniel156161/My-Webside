//Make Divs
const grid = document.querySelector('.gridclickdiv').querySelectorAll('div');
let i = 0
for(div of grid) {
  div.classList.add('clickdiv');
  if(i == 12) {
    div.innerHTML = 'just click anywhere';
  }
  i++;
}
//Clickdivs
const divs = document.querySelectorAll('.clickdiv');
switch (window.location.pathname) {
  //HEX
  case '/html/random_color/hex.htm':
    for(div of divs){
      div.addEventListener('click', function(e) {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        e.target.style.backgroundColor = color;
        e.target.innerHTML = color;
        navigator.clipboard.writeText(color);
      })
    }
    break;
  //HSL
  case '/html/random_color/hsl.htm':
    for (div of divs) {
      div.addEventListener('click', function (e) {
        color = 'hsl(' + Math.floor(Math.random() * 360) + ', ' + Math.floor(Math.random() * 100) + '%, ' + Math.floor(Math.random() * 100) + '%)';
        e.target.style.backgroundColor = color;
        e.target.innerHTML = color;
        navigator.clipboard.writeText(color);
      });
    }
    break;
  //RGB
  case '/html/random_color/rgb.htm':
    for (div of divs) {
      div.addEventListener('click', function (e) {
        color = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
        e.target.style.backgroundColor = color;
        e.target.innerHTML = color;
        navigator.clipboard.writeText(color);
      });
    }
    break;
}