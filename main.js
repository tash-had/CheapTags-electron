/**         
 * Imports 
 */
const electron = require("electron")
const url = require("url")
const path = require("path")
const {autoUpdater} = require("electron-updater");

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;



// Window vars 
let mainWindow, browseImagesWindow; 

// Events 


/**
 * UPDATES 
 */
app.on("ready", function() {
    mainWindow = createNewWindow({}); 
    loadURL(mainWindow, "index.html");    
    mainWindow.on("closed", function(){
        app.quit(); 
    });
    autoUpdater.checkForUpdates();
});
 
  // when the update has been downloaded and is ready to be installed, notify the BrowserWindow
  autoUpdater.on('update-downloaded', (info) => {
      win.webContents.send('updateReady')
  });
  
  // when receiving a quitAndInstall signal, quit and install the new version ;)
  ipcMain.on("quitAndInstall", (event, arg) => {
      autoUpdater.quitAndInstall();
  })

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
        title: folder,
        height: 720, 
        width: 1080
     }); 
     loadURL(browseImagesWindow, "browse.html"); 
     browseImagesWindow.webContents.on("did-finish-load", function(){
        browseImagesWindow.webContents.send("data:folderChosen", folder); 
     });
 } 