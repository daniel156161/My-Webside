const divshex = document.querySelectorAll('.clickdiv');

for(div of divshex){
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