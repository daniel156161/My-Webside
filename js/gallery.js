/**************************************************************************************
Gallery
**************************************************************************************/
const gallery = document.querySelector('#gallery');

fetch("../img/pictures.json")
  .then(response => response.json())
  .then(json => makeGallery(json));

function makeGallery(json) {
  gallery.innerHTML = "";
  for (let i = 0; i < json.mygallery.length; i++) {
    let htmltag = '<a href="../img/My_Imgs/'+json.mygallery[i].file+'" data-lightbox="mygallery" data-title="'+json.mygallery[i].title+'"><img src="../img/My_Tumb/'+json.mygallery[i].file+'" alt="' +json.mygallery[i].alt+'"></a>';
    gallery.innerHTML += htmltag;
  }
};
