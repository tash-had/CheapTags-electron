/**         
 * Imports 
 */
const electron = require("electron")
const url = require("url")
const path = require("path")

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

// Window vars 
let mainWindow, browseImagesWindow; 

// Events 
app.on("ready", function() {
    mainWindow = createNewWindow({}); 
    loadURL(mainWindow, "index.html");    
    mainWindow.on("closed", function(){
        app.quit(); 
    });
});

ipcMain.on("event:folderChosen", function(e, dir){
    let dirStr = String(dir); 
    createBrowseImagesWindow(dirStr); 
});

ipcMain.on("err:noPicsFound", function(e){
    browseImagesWindow.close(); 
});

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

 function createBrowseImagesWindow(folder) {
     // create window 
     browseImagesWindow = createNewWindow({
        title: folder
     }); 
     loadURL(browseImagesWindow, "browse.html"); 
     browseImagesWindow.webContents.on("did-finish-load", function(){
        browseImagesWindow.webContents.send("data:picPaths", folder); 
     });
 } 