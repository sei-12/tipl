export type Hotkey = {
    alt:boolean
    meta:boolean
    ctrl:boolean
    shift:boolean
    key:string
}

export const is_match_hotkey = function(e:KeyboardEvent,hotkey:Hotkey){
    if(e.metaKey != hotkey.meta){
        return false
    }
    if(e.altKey != hotkey.alt){
        return false
    }
    if(e.shiftKey != hotkey.shift){
        return false
    }
    if(e.ctrlKey != hotkey.ctrl){
        return false
    }

    return true
}