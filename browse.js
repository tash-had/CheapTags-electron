const electron = require("electron");
 
const {app, ipcRenderer} = electron;

const async = require("async");
const fs = require("fs"); 

const ACCEPTED_PICTURE_EXTENSIONS = [".jpg", ".png", ".jpeg", ".bmp", ".gif"]; 

M.AutoInit();

// currentWindow.toggleDevTools(); 

ipcRenderer.on("data:picPaths", function(e, folder){
    async.concat([folder], fs.readdir, function(err, files){
        filterPictures(folder, files, renderPictures); 
    });
});

function filterPictures(dirStr, files, callback){
    let picPathArr = []; 
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
    callback(picPathArr); 
}

function renderPictures(picPathArr){
    if (picPathArr.length == 0){
        //     alertify.confirm("The directory you selected doesn't contain any pictures.").then(function(){
        //         ipcRenderer.send("err:noPicsFound"); 
        //     }); 
        let elem = document.getElementById("noPicturesAlert");
        var instance = M.Modal.getInstance(elem);
        instance.options = {
            onCloseStart: sendNoPicsFoundErr,
            dismissible: true
        }

        // M.Modal.init(elem, options); 

        instance.open(); 

        // var elems = document.querySelectorAll('.modal');
        // var instances = M.Modal.init(elems, options);
    }
    for (let picPath of picPathArr){
        const img = document.createElement("img"); 
        img.className = "folderImage hover-shadow cursor"; 
        img.src = picPath; 
        img.style = "width:60%"; 
        img.addEventListener("click", function(){
            setSelectedImage(picPath); 
        });

        const folderContentsDiv = document.getElementById("folderContentsColDiv"); 
        folderContentsDiv.appendChild(img); 
    }   
}

function sendNoPicsFoundErr(){
    console.log("HI"); 
    ipcRenderer.send("err:noPicsFound"); 
}
function setSelectedImage(path){
    let selectedImg = document.getElementById("selectedImg"); 
    selectedImg.src = path;
}