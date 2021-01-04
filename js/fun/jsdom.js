//Chnage Body Background from div click
let divs = document.querySelectorAll('.clickdiv');

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