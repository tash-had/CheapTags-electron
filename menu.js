// create menu template 
const mainMenuTemplate = [  
    {
        label: "File", 
        submenu: [
            {
                label: "Add Item",
                accelerator: "CommandOrControl+N",
                click(){
                    createAddWindow(); 
                }
            },
            {
                label: "Clear Items",
                click(){
                    mainWindow.webContents.send("items:clear"); 
                }
            }, 
            {
                label: "Quit",
                accelerator: "CommandOrControl+Q",
                click(){
                    app.quit(); 
                }
            }
        ]
    }
]

if (process.platform == "darwin"){
    mainMenuTemplate.unshift({});
}

// Add Dev Tools if not in prod
if (process.env.NODE_ENV !== "production"){
    mainMenuTemplate.push({
        label: 'Developer Tools', 
        submenu: [
            {
                label: "Toggle Dev Tools", 
                accelerator: "Command+D", 
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools(); 
                }
            }, 
            {
                role: "reload",
                accelerator: "Command+R"
            }
        ]
    })
}