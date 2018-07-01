const electron = require("electron"); 
const {ipcRenderer} = electron; 
const {dialog} = electron.remote; 

// Declare elements 
const browseBtn = document.getElementById("selectFolderBtn"); 
browseBtn.addEventListener("click", chooseFolderAction);

function chooseFolderAction(e){
    e.preventDefault();
    let folder = dialog.showOpenDialog({properties: ['openDirectory']});        
    if (folder){
        ipcRenderer.send("event:folderChosen", folder);
    }         
}