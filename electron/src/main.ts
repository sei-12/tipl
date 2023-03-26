import { app, BrowserWindow, ipcMain } from 'electron'
import path = require('path')
import fs = require('fs')
import { exec } from 'child_process'


const current_dir = `${__dirname}/../../../`
const LINKS_JSON_PATH = current_dir + "test-datas/link.json"
const TAGS_JSON_PATH = current_dir + "test-datas/tags.json"

const mainURL = `file:${__dirname}/../../index.html`

const open_url = function(_:any,url:string){
    let cmd = `open ${url}`
    exec(cmd)
}

const open_google_chrome = function(_:any,words:string[]){
    let todo_rename = words.join("+")
    let url = "https://www.google.com/search?q=" + todo_rename
    open_url(null,url)
}

const createWidnow = () => {
    const mainWindow = new BrowserWindow({
        title:"tipl",
        width: 700,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    ipcMain.handle('load-link-json',async () => fs.readFileSync(LINKS_JSON_PATH,'utf-8') )
    ipcMain.handle('load-tags-json',async () => fs.readFileSync(TAGS_JSON_PATH,'utf-8') )
    ipcMain.handle('save-tags-json',(_:any,json_text:string) => {fs.writeFileSync(TAGS_JSON_PATH,json_text)})
    ipcMain.handle('save-link-json',(_:any,json_text:string) => {fs.writeFileSync(LINKS_JSON_PATH,json_text)})
    
    ipcMain.handle('open-url',open_url)
    ipcMain.handle('open-google-chrome',open_google_chrome)
    mainWindow.loadURL(mainURL)
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
