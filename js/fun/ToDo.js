let pageLoad = 0;
let addItemOnlyOnce = 0;
const board = document.querySelector('#board');

const localKey = 'ToDo';

/***************************************************************************************************************
Remove into localStorage the Key
***************************************************************************************************************/
document.querySelector('#removeall').addEventListener('click', () => {
  localStorage.removeItem(localKey);
  lists.items = [];
  changeBoard.showList();
});
/***************************************************************************************************************
Change the Boarder
***************************************************************************************************************/
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
      let addDivField = document.createElement('input');
      addDivField.setAttribute('id', 'addfield');
      addDivField.setAttribute('type', 'text');
      addDivField.setAttribute('placeholder', 'List Title...');
      addDivField.addEventListener('keydown', this.addList);

      let cleanaddlist = document.createElement('i');
      cleanaddlist.setAttribute('class', 'fas fa-eraser');
      cleanaddlist.addEventListener('click', () => {
        addDivField.value = '';
      });
      let buttonDiv = document.createElement('div');
      buttonDiv.setAttribute('class', 'buttons');
      let addbutton = document.createElement('input');
      addbutton.setAttribute('id', 'addbutton');
      addbutton.setAttribute('type', 'button');
      addbutton.setAttribute('value', 'Add List');
      addbutton.addEventListener('click', this.addList);

      let itemDiv = this.makeInputAndItemsDiv();
      buttonDiv.appendChild(addbutton);
      textDiv.appendChild(addDivField);
      textDiv.appendChild(cleanaddlist);
      itemDiv.appendChild(textDiv);
      itemDiv.appendChild(buttonDiv);
    }
  },
  addList: function(e) {
    if (e.key === 'Enter' || e.type === 'click') {
      let addDivField = document.querySelector('#addfield');
      var listTitle = addDivField.value;
      if(listTitle != '') {
        lists.addList(listTitle);
      }
    }
  },
  addCard: function(addfield, cardDiscr, i_list, form) {
    var CardTitle = addfield.value;
    if(CardTitle != '') {
      lists.addCard(CardTitle, cardDiscr, i_list);
    }
    form.classList.remove('hidden');
  },
  showList: function() {
    board.innerHTML = '';
    for (let i_list = 0; i_list < lists.items.length; i_list++) {
      var listObject = lists.items[i_list];
      let itemDiv = this.makeInputAndItemsDiv();
      let title = document.createElement('p');
      title.setAttribute('class', 'title');
      title.innerText = listObject.Title;
      let removeList = document.createElement('i');
      removeList.setAttribute('class', 'fas fa-trash');
      removeList.addEventListener('click', () => {
        lists.items.splice(i_list, 1);
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
        for (let i_card = 0; i_card < listObject.Cards.length; i_card++) {
          let itemDiv = document.createElement('div');
          itemDiv.setAttribute('class', `done-${listObject.Cards[i_card].isDone}`);
          itemDiv.setAttribute('id', `item-${i_list}-${i_card}`);
          itemDiv.innerText = listObject.Cards[i_card].title;
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
          itemDone.setAttribute('class', `fas fa-${lists.isItemDone(i_list, i_card)}`);
          
          let removeCard = document.createElement('i');
          removeCard.setAttribute('class', 'fas fa-minus');
  
          itemButtons.appendChild(itemDone);
          itemButtons.appendChild(removeCard);
          inputDiv.appendChild(itemDiv);
        }
      }
      this.addCardButton(inputDiv, i_list);
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
  addCardButton: function(input, i_list) {
    let form = document.createElement('div');
    form.setAttribute('class', 'form');
    form.setAttribute('id', 'ItemAddButtonList');
    
    let button = document.createElement('div');
    button.setAttribute('class', 'buttons');

    let addbutton = this.makeAddTaskBtn();
    addbutton.addEventListener('click', () => {
      if (addItemOnlyOnce == 0) {
        addItemOnlyOnce = 1;
      } else {
        addItemOnlyOnce = 0;
        this.showList();
      }
      this.addMoreItems(input, form, i_list);
    });

    button.appendChild(addbutton);
    form.appendChild(button);
    input.appendChild(form);
  },
  addMoreItems: function(input, form, i_list) {
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
        this.addCard(addfield, cardDiscr, i_list, form);
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
      this.addCard(addfield, cardDiscr, i_list, form);
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
  showPopUp: function(i_list, i_card) {
    ModalCont.innerHTML = '';

    let done;
    let card = lists.items[i_list].Cards[i_card];
    
    let title = document.createElement('h1');
    title.innerText = card.title;

    //Make Card DONE
    card.isDone == true ? done = 'DONE' : done = 'not Done';

    let doneMsg = document.createElement('p')
    doneMsg.setAttribute('class', 'classDone')
    doneMsg.innerText = `This Task is: ${done}`;

    ModalCont.appendChild(title);
    ModalCont.appendChild(doneMsg);

    if(card.descr != '') {
      ModalCont.innerHTML += '<h3>Description</h3>';
      let descrText = document.createElement('p');
      descrText.innerText = card.descr;
      ModalCont.appendChild(descrText);
    }

    ModalCont.innerHTML += `<br><p class="TaskCreatet">Task Createt: ${timeConverter(card.timestemp)}</p>`
    modal.style.display = 'block';
  }
}
/***************************************************************************************************************
Lists Storage and Methods
***************************************************************************************************************/
const lists = {
  items: [],
  updateLists: function() {
    LocalStorageHelper.set(localKey, this.items);
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
  addCard: function(Title, cardDiscr, i_list) {
    Card = {
      title: Title,
      descr: cardDiscr.value,
      isDone: false,
      timestemp: Date.now()
    };
    addItemOnlyOnce = 0;
    this.items[i_list].Cards.push(Card);
    this.updateLists();
  },
  removeCard: function(i_list, i_card) {
    this.items[i_list].Cards.splice(i_card, 1);
    this.updateLists();
  },
  makeItemDone: function(i_list, i_card) {
    let object = this.items[i_list];
    let cards = object.Cards[i_card];
    if(cards.isDone == false) {
      cards.isDone = true;
    } else {
      cards.isDone = false;
    }
    this.items[i_list] = object;
    LocalStorageHelper.set(localKey, this.items);
    changeBoard.showList();
  },
  isItemDone: function(i_list, i_card) {
    if(this.items[i_list].Cards[i_card].isDone == false) {
      return 'check';
    } else {
      return 'times';
    }
  }
}
/***************************************************************************************************************
Pop Up | Task Details
***************************************************************************************************************/
const modal = document.querySelector('#myModal');
const ModalSpan = document.querySelector('.close');
const ModalCont = document.querySelector('#ModalCont');
ModalSpan.addEventListener('click', () => {
  modal.style.display = 'none';
});
window.addEventListener('click', e => {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
});
/***************************************************************************************************************
Converter Unix time to User Time
***************************************************************************************************************/
function timeConverter(UNIX_timestamp){
  var time = new Date(UNIX_timestamp).toLocaleString(navigator.language);
  return time;
}
/***************************************************************************************************************
Local Storage [SAVE, LOAD]
***************************************************************************************************************/
if(localStorage.length != 0) {
  const localOut = LocalStorageHelper.get(localKey);
  if (localOut != null) {
    lists.items = localOut;
    lists.items.length > 0 ? changeBoard.showList() : changeBoard.addDiv();
  } else {
    changeBoard.addDiv();
  }
} else {
  changeBoard.addDiv();
}