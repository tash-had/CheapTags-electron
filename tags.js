const electron = require("electron"); 
const ul = document.querySelector("ul"); 
const Store = require('electron-store');
const store = new Store();

function addListItem(item){
    const itemText = document.createTextNode(item); 
    const li = document.createElement("li"); 
    li.className = "collection-item"; 
    
    li.appendChild(itemText); 
    ul.appendChild(li);   
    if (ul.childElementCount == 0){
        ul.className = "collection"; 
    }
}

function addNewTagToDB(tag){
    let tags = store.get("tags"); 
    tag = tag.toLowerCase(); 
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

function removeTagFromDB(tag){
    let tags = store.get("tags"); 
    tag = tag.toLowerCase(); 
    if (tags){
        if (tags.includes(tag)){
            tags.splice(tags.indexOf(tag), 1);
        }else{
            return false; 
        }
    }else{
        tags = []; 
    }
    store.set("tags", tags); 
    return true; 
}

function removeItem(item){
    item = item.target; 
    if (removeTagFromDB(item.innerHTML)){
        if (item != ul){
            item.remove(); 
        }
        if (ul.childElementCount == 0){
            ul.className = ''; 
        }
    }
}

window.onload = function(){
    loadAllTags();
    const newTagInput = document.getElementById("tagInput"); 
    newTagInput.addEventListener("keypress", function(e){
        if (e.keyCode == 13) {
            const tag = newTagInput.value;
            if (tag && addNewTagToDB(tag)){
                addListItem(tag); 
                newTagInput.value = ""; 
            }
        }
    }); 
    ul.addEventListener("dblclick", removeItem);
}

function loadAllTags(){
    let tags = store.get("tags"); 
    if (tags){
        for (let tag of tags){
            addListItem(toTitleCase(tag)); 
        }
    }
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}