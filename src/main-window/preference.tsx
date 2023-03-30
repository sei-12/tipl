
import { parse_pref, Pref } from "../models/pref-model";

export let preference : Pref | null = null

const set_pref = async () => {
    preference = parse_pref(...await window.electronAPI.load_pref_json())
}

// pref windowの方で実行させたくない
if(window.electronAPI != undefined){
    window.addEventListener('load',set_pref)
    window.electronAPI.on_update_pref(set_pref)
}
