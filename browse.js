const electron = require("electron");
 
const {app, ipcRenderer} = electron;

const async = require("async");
const fs = require("fs"); 

const ACCEPTED_PICTURE_EXTENSIONS = [".jpg", ".png", ".jpeg", ".bmp", ".gif"]; 

M.AutoInit();

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
        img.style = "width:70%"; 
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
    selectedImg.style = "width:150%;height:150%;"; 
}

/** TURNING TAGS TO TAG BOXES */

[].forEach.call(document.getElementsByClassName('tags-input'), function (el) {
    let hiddenInput = document.createElement('input'),
    mainInput = document.createElement('input'),
    tags = [];
    
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', el.getAttribute('data-name'));
    
    mainInput.setAttribute('type', 'text');
    mainInput.classList.add('main-input');
    mainInput.addEventListener('input', function () {
        let enteredTags = mainInput.value.split(',');
        if (enteredTags.length > 1) {
            enteredTags.forEach(function (t) {
                let filteredTag = filterTag(t);
                if (filteredTag.length > 0)
                addTag(filteredTag);
            });
            mainInput.value = '';
        }
    });
    
    mainInput.addEventListener('keydown', function (e) {
        let keyCode = e.which || e.keyCode;
        if (keyCode === 8 && mainInput.value.length === 0 && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    });
    
    el.appendChild(mainInput);
    el.appendChild(hiddenInput);
    
    addTag('hello!');
    
    function addTag (text) {
        let tag = {
            text: text,
            element: document.createElement('span'),
        };
        
        tag.element.classList.add('tag');
        tag.element.textContent = tag.text;
        
        let closeBtn = document.createElement('span');
        closeBtn.classList.add('close');
        closeBtn.addEventListener('click', function () {
            removeTag(tags.indexOf(tag));
        });
        tag.element.appendChild(closeBtn);
        
        tags.push(tag);
        
        el.insertBefore(tag.element, mainInput);
        
        refreshTags();
    }
    
    function removeTag (index) {
        let tag = tags[index];
        tags.splice(index, 1);
        el.removeChild(tag.element);
        refreshTags();
    }
    
    function refreshTags () {
        let tagsList = [];
        tags.forEach(function (t) {
            tagsList.push(t.text);
        });
        hiddenInput.value = tagsList.join(',');
    }
    
    function filterTag (tag) {
        return tag.replace(/[^\w -]/g, '').trim().replace(/\W+/g, '-');
    }
});