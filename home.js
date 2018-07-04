const electron = require("electron"); 
// const {ipcRenderer} = electron; 
const {dialog, BrowserWindow} = electron.remote; 
const Store = require('electron-store');
const currentWindow = electron.remote.getCurrentWindow();
const url = require("url")
const path = require("path")

// Declare elements 
const browseBtn = document.getElementById("selectFolderBtn"); 
const viewTagsBtn = document.getElementById("viewTagsBtn"); 
const store = new Store();

let prevVisited = store.get("prevVisited"); 
if (!prevVisited){
    prevVisited = []; 
}

browseBtn.addEventListener("click", chooseFolderAction);
viewTagsBtn.addEventListener("click", function(){
    let viewTagsWindow = createNewWindow({
        height: 720, 
        width: 1080
     }); 
     loadURL(viewTagsWindow, "tags.html"); 
});

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

function loadURL(baseWindow, fileName){
    baseWindow.loadURL(url.format({
        pathname: path.join(__dirname, fileName), 
        protocol: "file:",
        slashes: true
    }));
}

/**
 * Window Creation 
 */

 function createNewWindow(properties) {
     let bw =  new BrowserWindow(properties);
     bw.on("close", function(){
         bw = null; 
     });
     return bw;  
 }
