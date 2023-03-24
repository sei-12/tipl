export interface IElectronAPI {
    version: () => string

    open_url:(url:string) => void
    open_google_chrome:(words:string[]) => void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}