export interface PrefAPI {
    load_pref_json:() => Promise<[string,string]>
    save_pref_json:(json_text:string) => void
}

declare global {
    interface Window {
        prefAPI: PrefAPI
    }
}