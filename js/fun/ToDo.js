let pageLoad = 0;
let addItemOnlyOnce = 0;
const board = document.querySelector('#board');

const localKey = 'ToDo';

document.querySelector('#removeall').addEventListener('click', () => {
  localStorage.removeItem(localKey);
  lists.items = [];
  changeBoard.addList();
});

var changeBoard = {
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
      //ADDlist to Boarder
      let textDiv = document.createElement('div');
      textDiv.setAttribute('class', 'text');
      let addfield = document.createElement('input');
      addfield.setAttribute('id', 'addfield');
      addfield.setAttribute('type', 'text');
      addfield.setAttribute('placeholder', 'Listentitle ...');
      addfield.addEventListener('keydown', e => {
        if (e.isComposing || e.key === 'Enter') {
          var listTitle = addfield.value;
          if(listTitle != '') {
            lists.add(listTitle);
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
          lists.add(listTitle);
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
  addList: function() {
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
        lists.updatelocal();
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
          itemDiv.innerHTML = listObject.Cards[i2].text;
          let itemButtons = document.createElement('div');
          itemButtons.setAttribute('class', 'itemButton');
          itemDiv.appendChild(itemButtons);
          let itemDone = document.createElement('i');
          itemDone.setAttribute('class', `fas fa-${lists.isItemDone(i, i2)}`);
          itemDone.setAttribute('onclick', `lists.doneItem(${i}, ${i2})`);
          let removeItem = document.createElement('i');
          removeItem.setAttribute('class', 'fas fa-minus');
          removeItem.setAttribute('onclick', `lists.removeItem(${i}, ${i2})`);
  
          itemButtons.appendChild(itemDone);
          itemButtons.appendChild(removeItem);
          inputDiv.appendChild(itemDiv);
        }
        lists.addEintrag(inputDiv, i);
      } else {
        lists.addEintrag(inputDiv, i);
      }
    }
    this.addDiv();
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
    addfield.setAttribute('placeholder', 'Itemname ...');
    addfield.addEventListener('keydown', e => {
      if (e.isComposing || e.key === 'Enter') {
        let Item = addfield.value;
        if(Item != '') {
          addItemOnlyOnce = 0;
          form.classList.remove('hidden');
          lists.addCard(i, Item);
          this.addList();
        }
      }
    });

    let upaddlist = document.createElement('i');
    upaddlist.setAttribute('class', 'fas fa-chevron-up');
    upaddlist.addEventListener('click', () => {
      addItemOnlyOnce = 0;
      changeBoard.addList();
    });

    let cleanaddlist = document.createElement('i');
    cleanaddlist.setAttribute('class', 'fas fa-eraser');
    cleanaddlist.addEventListener('click', () => {
      addfield.value = '';
    });
    let buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class', 'buttons');
    let addbutton = document.createElement('input');
    addbutton.setAttribute('id', 'addItemCard');
    addbutton.setAttribute('type', 'button');
    addbutton.setAttribute('value', 'Add Item');
    addbutton.addEventListener('click', () => {
      let Item = addfield.value;
      if(Item != '') {
        addItemOnlyOnce = 0;
        form.classList.remove('hidden');
        lists.addCard(i, Item);
        this.addList();
      }
    });

    buttonDiv.appendChild(addbutton);
    textDiv.appendChild(addfield);
    textDiv.appendChild(upaddlist);
    textDiv.appendChild(cleanaddlist);

    newFormDiv.appendChild(textDiv);
    newFormDiv.appendChild(buttonDiv);
    input.appendChild(newFormDiv);
  }
}
//Lists Storage and functions
var lists = {
  items: [],
  add: function (title) {
    var list = { 
      Title: title,
      Cards: []
    };
    this.items.push(list);
    localObject.set(localKey, this);
    changeBoard.addList();
  },
  updatelocal: function() {
    localObject.set(localKey, this);
    changeBoard.addList();
  },
  addCard: function(i, item) {
    let object = lists.items[i];
    Card = {
      text: item,
      isDone: false
    };
    object.Cards.push(Card);
    lists.items[i] = object;
    localObject.set(localKey, this);
  },
  addEintrag: function(input, i) {
    let form = document.createElement('div');
    form.setAttribute('class', 'form');
    form.setAttribute('id', 'ItemAddButtonList');
    let button = document.createElement('div');
    button.setAttribute('class', 'buttons');
    let ibutton = document.createElement('input');
    ibutton.setAttribute('class', 'addItem');
    ibutton.setAttribute('type', 'button');
    ibutton.setAttribute('value', 'Add Item');
    ibutton.addEventListener('click', () => {
      if (addItemOnlyOnce == 0) {
        addItemOnlyOnce = 1;
      } else {
        addItemOnlyOnce = 0;
        changeBoard.addList();
      }
      changeBoard.addMoreItems(input, form, i);
    });

    button.appendChild(ibutton);
    form.appendChild(button);
    input.appendChild(form);
  },
  removeCard: function(item, i) {
    var object = lists.items[i];
    object.Cards = item;
    lists.items[i] = object;
    localObject.set(localKey, this);
    changeBoard.addList();
  },
  removeItem: function(i, i2) {
    let item = lists.items[i];
    item.Cards.splice([i2], 1);
    lists.removeCard(item.Cards, i);
  },
  doneItem: function(i, i2) {
    let object = lists.items[i];
    if(object.Cards[i2].isDone == false) {
      object.Cards[i2].isDone = true;
    } else {
      object.Cards[i2].isDone = false;
    }
    lists.items[i] = object;
    localObject.set(localKey, this);
    changeBoard.addList();
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
//Make Object into LocalStorage
let localObject = {
  set: function(key, Object) {
    if (typeof key == 'string' && typeof Object == 'object') {
      localStorage.setItem(key, JSON.stringify(Object));
    } else {
      console.log('Key is not a String or Input Object is not a Object');
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
    if (localStorage.key(i) === localKey) {
      let localLists = localObject.get(localKey);
      lists.items = localLists.items;
      if(lists.items.length > 0) {
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