const divs = document.querySelectorAll('.clickdiv');

for (div of divs) {
  div.addEventListener('click', function (e) {
    color = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
    e.target.style.backgroundColor = color;
    e.target.innerHTML = color;
    navigator.clipboard.writeText(color);
  });
}