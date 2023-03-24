import { contextBridge } from "electron"

contextBridge.exposeInMainWorld("electronAPI", {
    version: () => "1.0.0",

    open_url:(url:string) => ipcRenderer.invoke('open-url'),
    open_google_chrome:(words:string[]) => ipcRenderer.invoke('open-google-chrome'),
})
