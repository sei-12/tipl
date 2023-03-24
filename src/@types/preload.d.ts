export interface IElectronAPI {
    version: () => string
    load_links_json:() => Promise<string>
    save_links_json:(json_text:string) => void
    load_tags_json:() => Promise<string>
    save_tags_json:(json_text:string) => void

    open_url:(url:string) => void
    open_google_chrome:(words:string[]) => void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}