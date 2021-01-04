/**************************************************************************************
Gallery
**************************************************************************************/
const gallery = document.querySelector('#mygallery');
const flowers = document.querySelector('#flowers');
const h3s = document.querySelectorAll('h3');

fetch("../img/pictures.json")
  .then(response => response.json())
  .then(json => makeGallery(json));

function makeGallery(json) {
  gallery.innerHTML = "";
  //mygallery
  for (let i = 0; i < json.mygallery.length; i++) {
    let htmltag = '<a href="../img/My_Imgs/'+json.mygallery[i].file+'" data-lightbox="mygallery" data-title="'+json.mygallery[i].title+'"><img src="../img/My_Tumb/'+json.mygallery[i].file+'" alt="' +json.mygallery[i].alt+'"></a>';
    gallery.innerHTML += htmltag;
  }
  //Flowers
  for (let i = 0; i < json.flowers.length; i++) {
    let htmltag = '<a href="../img/My_Imgs/flowers/'+json.flowers[i].file+'" data-lightbox="flowers" data-title="'+json.flowers[i].title+'"><img src="../img/My_Tumb/flowers/'+json.flowers[i].file+'" alt="' +json.flowers[i].alt+'"></a>';
    flowers.innerHTML += htmltag;
  }
  //h3
  for(h3 of h3s) {
    h3.classList.remove('none');
  }
};
