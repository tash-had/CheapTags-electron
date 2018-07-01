const electron = require("electron"); 
const {ipcRenderer} = electron; 
const {dialog} = electron.remote; 
const Store = require('electron-store');
const currentWindow = electron.remote.getCurrentWindow();

// Declare elements 
const browseBtn = document.getElementById("selectFolderBtn"); 
const store = new Store();

let prevVisited = store.get("prevVisited"); 


browseBtn.addEventListener("click", chooseFolderAction);

function chooseFolderAction(e){
    e.preventDefault();
    let folder = dialog.showOpenDialog({properties: ['openDirectory']});        
    folderChosen(folder); 
}

function folderChosen(folder){
    if (folder){
        storeVisitedFolder(String(folder)); 
        ipcRenderer.send("event:folderChosen", folder);
    }     
}

window.onload = function(){
    currentWindow.webContents.send("data:prevVisited", prevVisited); 
}

function storeVisitedFolder(folder){
    if (!prevVisited){
        prevVisited = []; 
    }else if(prevVisited.includes(folder)){
        return;
    }
    prevVisited.push(folder); 
    store.set("prevVisited", prevVisited)
}
