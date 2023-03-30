export type Hotkey = {
    alt:boolean
    meta:boolean
    ctrl:boolean
    shift:boolean
    key:string
}

//todo rename
export const is_hotkey_match = function(e:KeyboardEvent,pref_hotkey:Hotkey) : boolean{
    if(e.altKey !== pref_hotkey.alt){
        return false
    }
    if(e.metaKey !== pref_hotkey.meta){
        return false
    }
    if(e.shiftKey !== pref_hotkey.shift){
        return false
    }
    if(e.ctrlKey !== pref_hotkey.ctrl){
        return false
    }
    if(e.key !== pref_hotkey.key){
        return false
    }
    return true
}

const is_hotkey = function(check_hotkey:any) : boolean{
    if(check_hotkey.alt === undefined || typeof check_hotkey.alt !== 'boolean'){
        return false
    }
    if(check_hotkey.meta === undefined || typeof check_hotkey.meta !== 'boolean'){
        return false
    }
    if(check_hotkey.ctrl === undefined || typeof check_hotkey.ctrl !== 'boolean'){
        return false
    }
    if(check_hotkey.shift === undefined || typeof check_hotkey.shift !== 'boolean'){
        return false
    }
    if(check_hotkey.key === undefined || typeof check_hotkey.key !== 'string'){
        return false
    }
    return true
}

export type Pref = {
    focus_up:Hotkey
}

const is_pref = function(check_pref:any) : boolean {
    if(check_pref.focus_up === undefined || is_hotkey(check_pref.focus_up) === false ){
        return false
    }

    return true
}

export const parse_pref = function(pref_json:string,default_pref_json:string) : Pref{
    let pref = JSON.parse(pref_json)

    if(is_pref(pref) === false){
        pref = JSON.parse(default_pref_json) as Pref
    }

    return pref
}
