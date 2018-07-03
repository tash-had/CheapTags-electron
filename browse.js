const electron = require("electron");
 
const {app, ipcRenderer} = electron;

const async = require("async");
const fs = require("fs"); 
const Store = require('electron-store');
window.$ = window.jQuery = require("./js/jquery.min.js")
let selectedImg = document.getElementById("selectedImg"); 

const ACCEPTED_PICTURE_EXTENSIONS = [".jpg", ".png", ".jpeg", ".bmp", ".gif"]; 
const store = new Store();
M.AutoInit();

window.onload = function(){
    $("#tagsFooter").hide()
    $('#tagsInput').tagsInput({
        'height':'100%',
        'width':'100%',
        'defaultText':'...',
        'placeholderColor' : '#666666',
        'onAddTag':storeNewTag,
        'onRemoveTag':removeTagFromStore,
    });
}
// store.clear();
// currentWindow.toggleDevTools(); 

ipcRenderer.on("data:folderChosen", function(e, folder){
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
        let elem = document.getElementById("noPicturesAlert");
        var instance = M.Modal.getInstance(elem);
        instance.options = {
            onCloseStart: sendNoPicsFoundErr,
            dismissible: true
        }
        instance.open(); 
    }
    for (let picPath of picPathArr){
        const img = document.createElement("img"); 
        img.className = "folderImage hover-shadow cursor"; 
        img.src = picPath; 
        img.style = "width:70%"; 
        img.addEventListener("click", function(){
            setSelectedImage(picPath); 
        });

        const folderContentsDiv = document.getElementById("folderContentsColDiv"); 
        folderContentsDiv.appendChild(img); 
    }   
}

function sendNoPicsFoundErr(){
    ipcRenderer.send("err:noPicsFound"); 
}
function setSelectedImage(path){
    selectedImg.src = path;
    selectedImg.style = "width:150%;height:150%;";
    $("#tagsFooter").show();  
    loadTags(); 
}

function getSelectedPicturePath(){
    return selectedImg.src; 
}

function loadTags(){
    $('#tagsInput').importTags('');
    let tagList = store.get(getSelectedPicturePath()); 
    if (tagList){
        for (let tag of tagList){
            $("#tagsInput").addTag(tag); 
        }
    }
}

function storeNewTag(tag){
    let tagList = store.get(getSelectedPicturePath()); 
    let allTags = store.get("tags"); 

    if (tagList && !tagList.includes(tag)){
        tagList.push(tag);
    }else if (!tagList){
        tagList = [tag]; 
    }
    if (!allTags || !allTags.includes(tag.toLowerCase())){
        if (!allTags){
            allTags = []; 
        }
        allTags.push(tag.toLowerCase()); 
        store.set("tags", allTags); 
    }
    store.set(getSelectedPicturePath(), tagList); 
}

function removeTagFromStore(tag){
    let tagList = store.get(getSelectedPicturePath()); 
    if (tagList && tagList.includes(tag)){
        tagList.splice(tagList.indexOf(tag), 1); 
        store.set(getSelectedPicturePath(), tagList); 
    }
}