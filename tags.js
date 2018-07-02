const electron = require("electron"); 
const ul = document.querySelector("ul"); 
const Store = require('electron-store');
const store = new Store();

function addListItem(item){
    if (addNewTagToDB(item)){
        const itemText = document.createTextNode(item); 
        const li = document.createElement("li"); 
        li.className = "collection-item"; 
        
        li.appendChild(itemText); 
        ul.appendChild(li);   
        if (ul.childElementCount == 0){
            ul.className = "collection"; 
        }
    }
}

function addNewTagToDB(tag){
    let tags = store.get("tags"); 
    if (tags){
        if (tags.includes(tag)){
            return false; 
        }else{
            tags.push(tag); 
        }
    }else{
        tags = []; 
    }
    store.set("tags", tags); 
    return true; 
}

function processNewTag(e){
    e.preventDefault(); 
    const item = document.querySelector("#item").value;
    if (item){
        addListItem(item); 
    }
}

function removeItem(item){
  if (item.target != ul){
    item.target.remove(); 
  }
  if (ul.childElementCount == 0){
    ul.className = ''; 
  }
}

window.onload = function(){
    const form = document.querySelector("form"); 
    ul.addEventListener("dblclick", removeItem);
    form.addEventListener('submit', processNewTag);
}

