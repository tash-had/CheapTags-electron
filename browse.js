const electron = require("electron"); 
const {ipcRenderer} = electron; 
const currentWindow = electron.remote.getCurrentWindow(); 
const async = require("async");

const fs = require("fs"); 

const ACCEPTED_PICTURE_EXTENSIONS = [".jpg", ".png", ".jpeg", ".bmp", ".gif"]; 

currentWindow.toggleDevTools(); 

ipcRenderer.on("data:picPaths", function(e, folder){
    let picPathArr = []
    async.concat([folder], fs.readdir, function(err, files){
        // picPathArr = filterPictures(folder, files); 
        for (let fileName of files){
            let lastDot = fileName.lastIndexOf("."); 
            if (lastDot > 0){
                let ext = fileName.substring(lastDot);
                if (ACCEPTED_PICTURE_EXTENSIONS.includes(ext)){
                    let picPath = folder + "/" + fileName; 
                    picPathArr.push(picPath); 
                }
            }
        }
    });
    console.log(picPathArr); 
});

function filterPictures(dirStr, files){
    let picPathArr = []
    for (let fileName of files){
        let lastDot = fileName.lastIndexOf("."); 
        if (lastDot > 0){
            let ext = fileName.substring(lastDot);
            if (ACCEPTED_PICTURE_EXTENSIONS.includes(ext)){
                let picPath = dirStr + "/" + fileName; 
                picPathArr.push(picPath); 
            }
        }
    }
    return picPathArr; 
}