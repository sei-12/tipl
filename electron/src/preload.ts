import { contextBridge ,ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("electronAPI", {
    version: () => "1.0.0",

    load_links_json:() => ipcRenderer.invoke('load-link-json'),
    save_links_json:(json_text:string) => ipcRenderer.invoke('save-link-json',json_text),
    load_tags_json:() => ipcRenderer.invoke('load-tags-json'),
    save_tags_json:(json_text:string) => ipcRenderer.invoke('save-tags-json',json_text),

    open_url:(url:string) => ipcRenderer.invoke('open-url',url),
    open_google_chrome:(words:string[]) => ipcRenderer.invoke('open-google-chrome',words),
    onActivateApp:(callback:() => void) => ipcRenderer.on('active-app',callback),
    load_pref_json:() => ipcRenderer.invoke('app-load-pref-json'),
    on_update_pref:(callback:() => void) => ipcRenderer.on('update-pref',callback),
})
