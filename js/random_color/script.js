const divs = document.querySelectorAll('div')
const codediv = document.querySelector('#d20')
const header = document.querySelector('header')
const headeritems = document.querySelectorAll('.bakground')

function random_color() {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var bgColor = "rgb(" + x + "," + y + "," + z + ")";
  return bgColor
}

for(div of divs) {
  if(div.classList[0] != 'hamburger') {
    if(div.classList[0] != 'grid') {
      div.style.backgroundColor = random_color()
    }
  }
}

const random = document.querySelector('.random')
random.addEventListener('click', function() {
  let randnum = Math.floor(Math.random() * 2);
  if (randnum == 0) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } else if (randnum == 1) {
    for (var i = 0; i < 1; i++) {
      color = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
    }
  } else if (randnum == 2) {
    for (var i = 0; i < 1; i++) {
      color = 'hsl(' + Math.floor(Math.random() * 360) + ', ' + Math.floor(Math.random() * 100) + '%, ' + Math.floor(Math.random() * 100) + '%)';
    }
  }
  for (div of divs) {
    if (div.classList[0] != 'grid') {
      div.style.backgroundColor = color;
    }
    navigator.clipboard.writeText(color);
  }
  header.style.backgroundColor = color;
  for(headeritem of headeritems) {
    headeritem.style.color = '#FFF'
  }
  for(child of header.children) {
    if(child.nodeName == 'H1') {
      child.firstChild.classList.add('overlay')
    } else {
      child.classList.add('overlay')
    }
  }
  codediv.innerHTML = '<span class="indexcode">' + color + '</span>';
});
