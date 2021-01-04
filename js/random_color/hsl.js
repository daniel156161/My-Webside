let divs = document.querySelectorAll('.clickdiv');

for (div of divs) {
  div.addEventListener('click', function (e) {
    color = 'hsl(' + Math.floor(Math.random() * 360) + ', ' + Math.floor(Math.random() * 100) + '%, ' + Math.floor(Math.random() * 100) + '%)';
    e.target.style.backgroundColor = color;
    e.target.innerHTML = color;
    navigator.clipboard.writeText(color);
  });
}