import { contextBridge ,ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("prefAPI", {
    load_pref_json:() => ipcRenderer.invoke('load-pref-json'),
    save_pref_json:(json_text:string) => ipcRenderer.invoke('save-pref-json',json_text),
})
