let pageLoad = 0;
let addItemOnlyOnce = 0;
const board = document.querySelector('#board');

document.querySelector('#removeall').addEventListener('click', () => {
  localStorage.removeItem('ToDo');
  lists.count = 0;
  lists.items = [];
  changeBoard.addList();
});

var changeBoard = {
  addDiv: function() {
    if (lists.count < 7) {
      //ADDlist to Boarder
      board.innerHTML += '<div class="list"><div class="items"><form><div class="text"><input id="addfield" type="text" placeholder="Listentitle eingeben ..."><i id="cleanaddlist" class="fas fa-eraser"></i></div><div class="buttons"><input id="addbutton" type="button" value="Liste hinzufügen"></div></div></form></div>';
      //ADD List
      var addListBtn = document.querySelector('#addbutton');
      var addfield = document.querySelector('#addfield');
      addListBtn.addEventListener('click', () => {
        var listTitle = addfield.value;
        if(listTitle != '') {
          lists.add(listTitle);
        }
      });
      document.querySelector('#cleanaddlist').addEventListener('click', () => {
        addfield.value = '';
      });
    }
  },
  addList: function() {
    board.innerHTML = "";
    for (let i = 0; i < lists.items.length; i++) {
      var listObject = JSON.parse(lists.items[i]);
      board.innerHTML += `<div class="list"><div class="items"><p class="title">${listObject.Title}<i class="removeList fas fa-trash"></i></p><div class="listitems"><div class="input"></div></div></div></div>`;
      lists.getCard(i, listObject);
    }
    this.addDiv();
    this.button();
  },
  button: function() {
    //REMOVE List and ADD Item
    const removeLists = document.querySelectorAll('.removeList');
    const addItems = document.querySelectorAll('.addItem');
    for (let i = 0; i < removeLists.length; i++) {
      removeLists[i].addEventListener('click', () => {
        lists.items.splice(i,1);
        lists.update();
      });
      addItems[i].addEventListener('click', () => {
        if (addItemOnlyOnce == 0) {
          addItemOnlyOnce = 1;
          buttons(i);
        } else {
          this.addList();
          buttons(i);
        }
      });
    }
  }
}
function buttons(i) {
  const listInput = document.querySelectorAll('.input');
  const ItemAddButtonList = document.querySelectorAll('#ItemAddButtonList');
  ItemAddButtonList[i].classList.add('hidden');
  listInput[i].innerHTML += `<form class="addCard"><div class="text"><input id="addfield" type="text" placeholder="Item eingeben ..."><i id="up" class="fas fa-chevron-up"></i><i id="cleanaddfield" class="fas fa-eraser"></i></div><div class="buttons"><input id="addItemCard" type="button" value="Item Hinzufügen"></div></div></div></form>`;
  document.querySelector('#up').addEventListener('click', () => {
    addItemOnlyOnce = 0;
    changeBoard.addList();
  });
  document.querySelector('#cleanaddfield').addEventListener('click', () => {
    let textfeld = document.querySelector('#addfield')
    textfeld.value = '';
  });
  document.querySelector('#addItemCard').addEventListener('click', () => {
    var Item = addfield.value;
    if(Item != '') {
      addItemOnlyOnce = 0;
      ItemAddButtonList[i].classList.remove('hidden');
      lists.addCarts(i, Item);
      changeBoard.addList();
    }
  });
}
//Lists Storage and functions
var lists = {
  count: 0,
  items: [],
  add: function (title) {
    var list = { 
      Title: title,
      count: 0,
      Items: []
    };
    this.items.push(JSON.stringify(list));
    this.count ++;
    localObject.set('ToDo', this);
    changeBoard.addList();
  },
  update: function() {
    lists.count = lists.count - 1;
    localObject.set('ToDo', this);
    changeBoard.addList();
  },
  addCarts: function(i, item) {
    let object = JSON.parse(lists.items[i]);
    object.count ++;
    object.Items.push(item);
    lists.items[i] = JSON.stringify(object);
    localObject.set('ToDo', this);
  },
  getCard: function(i, card) {
    const listInput = document.querySelectorAll('.input');
    if (card.count > 0) {
      listInput[i].innerHTML = '';
      for (let i2 = 0; i2 < card.count; i2++) {
        listInput[i].innerHTML += `<p>${card.Items[i2]}</p>`;
      }
      listInput[i].innerHTML += '<form id="ItemAddButtonList"><div class="buttons"><input class="addItem" type="button" value="Item Hinzufügen"></div></form>';
    } else {
      listInput[i].innerHTML = '<form id="ItemAddButtonList"><div class="buttons"><input class="addItem" type="button" value="Item Hinzufügen"></div></form>';
    }
  }
}
//Make Object into LocalStorage
let localObject = {
  set: function(key, Object) {
    if (typeof key == 'string') {
      localStorage.setItem(key, JSON.stringify(Object));
    }
  },
  get: function(key) {
    if (typeof key == 'string') {
      var item = localStorage.getItem(key);
      if (item != null) {
        item = JSON.parse(localStorage.getItem(key));
      } else {
        item = undefined;
      }
      return item;
    }
  }
}
//Load LocalStorage
if(localStorage.length != 0) {
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) === 'ToDo') {
      var localLists = localObject.get('ToDo');
      lists.count = localLists.count;
      lists.items = localLists.items;
      if(lists.count > 0) {
        changeBoard.addList();
      } else {
        changeBoard.addDiv();
      }
      pageLoad = 1;
    }
  }
  if (pageLoad == 0) {
    changeBoard.addDiv();
  }
} else {
  changeBoard.addDiv();
}