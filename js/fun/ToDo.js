let pageLoad = 0;
let addItemOnlyOnce = 0;
const board = document.querySelector('#board');

const localKey = 'ToDo';

document.querySelector('#removeall').addEventListener('click', () => {
  localStorage.removeItem(localKey);
  lists.items = [];
  changeBoard.showList();
});

const changeBoard = {
  makeInputAndItemsDiv: function() {
    let addnewDiv = document.createElement('div');
    addnewDiv.setAttribute('class', 'list');
    let itemDiv = document.createElement('div');
    itemDiv.setAttribute('class', 'items');

    addnewDiv.appendChild(itemDiv);
    board.appendChild(addnewDiv);
    return itemDiv;
  },
  addDiv: function() {
    if (lists.items.length < 7) {
      //AddList into the Boarder
      let textDiv = document.createElement('div');
      textDiv.setAttribute('class', 'text');
      let addfield = document.createElement('input');
      addfield.setAttribute('id', 'addfield');
      addfield.setAttribute('type', 'text');
      addfield.setAttribute('placeholder', 'List Title...');
      addfield.addEventListener('keydown', e => {
        if (e.isComposing || e.key === 'Enter') {
          var listTitle = addfield.value;
          if(listTitle != '') {
            lists.addList(listTitle);
          }
        }
      });

      let cleanaddlist = document.createElement('i');
      cleanaddlist.setAttribute('class', 'fas fa-eraser');
      cleanaddlist.addEventListener('click', () => {
        addfield.value = '';
      });
      let buttonDiv = document.createElement('div');
      buttonDiv.setAttribute('class', 'buttons');
      let addbutton = document.createElement('input');
      addbutton.setAttribute('id', 'addbutton');
      addbutton.setAttribute('type', 'button');
      addbutton.setAttribute('value', 'Add List');
      addbutton.addEventListener('click', () => {
        var listTitle = addfield.value;
        if(listTitle != '') {
          lists.addList(listTitle);
        }
      });

      let itemDiv = this.makeInputAndItemsDiv();
      buttonDiv.appendChild(addbutton);
      textDiv.appendChild(addfield);
      textDiv.appendChild(cleanaddlist);
      itemDiv.appendChild(textDiv);
      itemDiv.appendChild(buttonDiv);
    }
  },
  showList: function() {
    board.innerHTML = "";
    for (let i = 0; i < lists.items.length; i++) {
      var listObject = lists.items[i];
      let itemDiv = this.makeInputAndItemsDiv();
      let title = document.createElement('p');
      title.setAttribute('class', 'title');
      title.innerHTML = listObject.Title;
      let removeList = document.createElement('i');
      removeList.setAttribute('class', 'fas fa-trash');
      removeList.addEventListener('click', () => {
        lists.items.splice(i,1);
        lists.updateLists();
      });
      let listitems = document.createElement('div');
      listitems.setAttribute('class', 'listitems');
      let inputDiv = document.createElement('div');
      inputDiv.setAttribute('class', 'input');

      title.appendChild(removeList);
      itemDiv.appendChild(title);
      itemDiv.appendChild(listitems);
      listitems.appendChild(inputDiv);

      if (listObject.Cards.length > 0) {
        for (let i2 = 0; i2 < listObject.Cards.length; i2++) {
          let itemDiv = document.createElement('div');
          itemDiv.setAttribute('class', `done-${listObject.Cards[i2].isDone}`);
          itemDiv.setAttribute('id', `item-${i}-${i2}`);
          itemDiv.innerHTML = listObject.Cards[i2].title;
          itemDiv.addEventListener('click', e => {
            let id = e.currentTarget.id.split('-');
            if (e.target.localName == 'div') {
              this.showPopUp(id[1], id[2]);
            } else {
              if (e.target.classList[1] == 'fa-check' || e.target.classList[1] == 'fa-times') {
                lists.makeItemDone(id[1], id[2]);
              } else {
                lists.removeCard(id[1], id[2]);
              }
            }
          });
          
          let itemButtons = document.createElement('div');
          itemButtons.setAttribute('class', 'itemButton');

          itemDiv.appendChild(itemButtons);
          
          let itemDone = document.createElement('i');
          itemDone.setAttribute('class', `fas fa-${lists.isItemDone(i, i2)}`);
          
          let removeCard = document.createElement('i');
          removeCard.setAttribute('class', 'fas fa-minus');
  
          itemButtons.appendChild(itemDone);
          itemButtons.appendChild(removeCard);
          inputDiv.appendChild(itemDiv);
        }
      }
      this.addCardButton(inputDiv, i);
    }
    this.addDiv();
  },
  makeAddTaskBtn: function() {
    let addbutton = document.createElement('input');
    addbutton.setAttribute('class', 'addTask');
    addbutton.setAttribute('type', 'button');
    addbutton.setAttribute('value', 'Add Task');
    return addbutton;
  },
  addCardButton: function(input, i) {
    let form = document.createElement('div');
    form.setAttribute('class', 'form');
    form.setAttribute('id', 'ItemAddButtonList');
    
    let button = document.createElement('div');
    button.setAttribute('class', 'buttons');

    let addbutton = this.makeAddTaskBtn();
    addbutton.addEventListener('click', () => {
      console.log(addItemOnlyOnce);
      if (addItemOnlyOnce == 0) {
        addItemOnlyOnce = 1;
      } else {
        addItemOnlyOnce = 0;
        this.showList();
      }
      this.addMoreItems(input, form, i);
    });

    button.appendChild(addbutton);
    form.appendChild(button);
    input.appendChild(form);
  },
  makeCardObjet: function(addfield, cardDiscr, form, i) {
    if(addfield.value != '') {
      Card = {
        title: addfield.value,
        descr: cardDiscr.value,
        isDone: false,
        timestemp: Date.now()
      };
      addItemOnlyOnce = 0;
      form.classList.remove('hidden');
      lists.addCard(i, Card);
    }
  },
  addMoreItems: function(input, form, i) {
    form.classList.add('hidden');
    
    let newFormDiv = document.createElement('div');
    newFormDiv.setAttribute('class', 'form addCard');
    
    let textDiv = document.createElement('div');
    textDiv.setAttribute('class', 'text');
    
    let addfield = document.createElement('input');
    addfield.setAttribute('id', 'addfield');
    addfield.setAttribute('type', 'text');
    addfield.setAttribute('placeholder', 'Task Name...');
    addfield.addEventListener('keydown', e => {
      if (e.isComposing || e.key === 'Enter') {
        this.makeCardObjet(addfield, cardDiscr, form, i);
      }
    });

    let upaddlist = document.createElement('i');
    upaddlist.setAttribute('class', 'fas fa-chevron-up');
    upaddlist.addEventListener('click', () => {
      addItemOnlyOnce = 0;
      changeBoard.showList();
    });

    let cleanaddlist = document.createElement('i');
    cleanaddlist.setAttribute('class', 'fas fa-eraser');
    cleanaddlist.addEventListener('click', () => {
      addfield.value = '';
      cardDiscr.value = '';
    });
    
    let buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class', 'buttons');
    
    let addbutton = this.makeAddTaskBtn();
    addbutton.addEventListener('click', () => {
      this.makeCardObjet(addfield, cardDiscr, form, i);
    });
    let cardDiscr = document.createElement('textarea');
    cardDiscr.setAttribute('id', 'CardDescription');
    cardDiscr.setAttribute('name', 'CardDescription');
    cardDiscr.setAttribute('placeholder', 'Task Description...')

    buttonDiv.appendChild(addbutton);

    textDiv.appendChild(addfield);
    textDiv.appendChild(upaddlist);
    textDiv.appendChild(cleanaddlist);
    textDiv.appendChild(cardDiscr);

    newFormDiv.appendChild(textDiv);
    newFormDiv.appendChild(buttonDiv);
    input.appendChild(newFormDiv);
  },
  showPopUp: function(i, i2) {
    let done;
    let card = lists.items[i].Cards[i2];
    ModalCont.innerHTML = `<h1>${card.title}</h1>`;
    card.isDone == true ? done = 'DONE' : done = 'not Done';
    ModalCont.innerHTML += `This Task is: ${done}<br>`;
    if(card.descr != '') {
      ModalCont.innerHTML += `<h3>Description</h3>${card.descr}<br>`
    }
    ModalCont.innerHTML += `<br>Task Createt: ${timeConverter(card.timestemp)}`
    modal.style.display = "block";
  }
}
//Lists Storage and functions
const lists = {
  items: [],
  updateLists: function() {
    localObject.set(localKey, this.items);
    changeBoard.showList();
  },
  addList: function (title) {
    var list = { 
      Title: title,
      Cards: []
    };
    this.items.push(list);
    this.updateLists();
  },
  addCard: function(i, cardObj) {
    let object = lists.items[i];
    object.Cards.push(cardObj);
    lists.items[i] = object;
    this.updateLists();
  },
  removeCard: function(i, i2) {
    let item = lists.items[i];
    item.Cards.splice([i2], 1);

    //Get Endless Item Object
    /*
      var object = lists.items[i];
      object.Cards = item;
      lists.items[i] = object;
    */
    this.updateLists();
  },
  makeItemDone: function(i, i2) {
    let object = lists.items[i];
    if(object.Cards[i2].isDone == false) {
      object.Cards[i2].isDone = true;
    } else {
      object.Cards[i2].isDone = false;
    }
    lists.items[i] = object;
    localObject.set(localKey, this.items);
    changeBoard.showList();
  },
  isItemDone: function(i, i2) {
    let object = lists.items[i];
    if(object.Cards[i2].isDone == false) {
      return 'check';
    } else {
      return 'times';
    }
  }
}
//Pop Up
const modal = document.querySelector('#myModal');
const Modalspan = document.querySelector('.close');
const ModalCont = document.querySelector('#ModalCont');
Modalspan.addEventListener('click', () => {
  modal.style.display = "none";
});
window.addEventListener('click', e => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
});
//Converter Unix time to User Time
function timeConverter(UNIX_timestamp){
  var time = new Date(UNIX_timestamp).toLocaleString('de-AT');
  return time;
}
//Make Object into LocalStorage
const localObject = {
  set: function(key, Object) {
    typeof key == 'string' ? localStorage.setItem(key, JSON.stringify(Object)) : console.log('Key is not a String');
  },
  get: function(key) {
    if (typeof key == 'string') {
      var item = localStorage.getItem(key);
      item != null ? item = JSON.parse(localStorage.getItem(key)) : item = null;
      return item;
    }
  }
}
//Load LocalStorage
if(localStorage.length != 0) {
  const localOut = localObject.get(localKey);
  if (localOut != null) {
    lists.items = localOut;
    lists.items.length > 0 ? changeBoard.showList() : changeBoard.addDiv();
  } else {
    changeBoard.addDiv();
  }
} else {
  changeBoard.addDiv();
}