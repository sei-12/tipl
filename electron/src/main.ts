import { app, BrowserWindow, ipcMain } from 'electron'
import path = require('path')
import fs = require('fs')
import os = require('os')
import { exec } from 'child_process'


const current_dir = os.homedir() + "/.tipl/"
const LINKS_JSON_PATH = current_dir + "link.json"
const TAGS_JSON_PATH = current_dir + "tags.json"
const WINODW_BOUND_DATA = current_dir + "info.json"
const PREF_JSON_PATH = current_dir + "pref.json"

if(fs.existsSync(current_dir) == false){
    fs.mkdirSync(current_dir)
}
if(fs.existsSync(TAGS_JSON_PATH) == false){
    fs.writeFileSync(TAGS_JSON_PATH,"[]")
}
if(fs.existsSync(LINKS_JSON_PATH) == false){
    fs.writeFileSync(LINKS_JSON_PATH,"[]")
}
if(fs.existsSync(WINODW_BOUND_DATA) == false){
    fs.writeFileSync(WINODW_BOUND_DATA,"{\"width\": 800, \"height\": 1000}")
}
if(fs.existsSync(PREF_JSON_PATH) == false){
    fs.writeFileSync(PREF_JSON_PATH,"{}")
}

const DEFAULT_PREF_JSON_PATH = `${__dirname}/../../default-pref.json`
const mainURL = `file:${__dirname}/../../index.html`
const prefURL = mainURL + "#/pref"

const open_url = function(_:any,url:string){
    let cmd = `open \"${url}\"`
    exec(cmd)
}

const open_google_chrome = function(_:any,words:string[]){
    let todo_rename = words.join("+")
    let url = "https://www.google.com/search?q=" + todo_rename
    open_url(null,url)
}

const load_last_bounds = function() : Partial<Electron.Rectangle>{
    let bound : Partial<Electron.Rectangle>
    try{
        bound = JSON.parse(fs.readFileSync(WINODW_BOUND_DATA, 'utf8')) as Partial<Electron.Rectangle>
    }catch{
        bound = {width:500,height:300}
    }
    return 
}

const load_pref_json = function(){
    let pref = fs.readFileSync(PREF_JSON_PATH,'utf-8')
    let default_pref = fs.readFileSync(DEFAULT_PREF_JSON_PATH,'utf-8')
    return [pref,default_pref]
}

const createWidnow = () => {
    const create_pref_window = () => {
        const pref_window = new BrowserWindow({
            width:400,
            height:200,
            webPreferences: {
                preload: path.join(__dirname, "pref-preload.js")
            }
        })
    
        ipcMain.handle('load-pref-json',load_pref_json)
        ipcMain.handle('save-pref-json',(_:any,json_text:string) => {
            fs.writeFileSync(PREF_JSON_PATH,json_text)
            mainWindow.webContents.send('update-pref')
        })
    
        pref_window.loadURL(prefURL)
    }

    const mainWindow = new BrowserWindow({
        title:"tipl",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    mainWindow.setBounds(load_last_bounds())

    ipcMain.handle('load-link-json',async () => fs.readFileSync(LINKS_JSON_PATH,'utf-8') )
    ipcMain.handle('load-tags-json',async () => fs.readFileSync(TAGS_JSON_PATH,'utf-8') )
    ipcMain.handle('save-tags-json',(_:any,json_text:string) => {fs.writeFileSync(TAGS_JSON_PATH,json_text)})
    ipcMain.handle('save-link-json',(_:any,json_text:string) => {fs.writeFileSync(LINKS_JSON_PATH,json_text)})
    
    ipcMain.handle('open-url',open_url)
    ipcMain.handle('open-google-chrome',open_google_chrome)

    ipcMain.handle('app-load-pref-json',load_pref_json)
    
    mainWindow.on('close', function() {
        fs.writeFileSync(WINODW_BOUND_DATA, JSON.stringify(mainWindow.getBounds()));
    });

    app.on('browser-window-focus',() =>{
        mainWindow.webContents.send('active-app')
    })

    mainWindow.loadURL(mainURL)
    create_pref_window()
}



app.whenReady().then(() => {
    createWidnow()
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) createWidnow()
    })
})

app.on('window-all-closed', () => {
    app.quit()
})
