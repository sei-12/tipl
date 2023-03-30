export type Hotkey = {
    alt:boolean
    meta:boolean
    ctrl:boolean
    shift:boolean
    key:string
}

/**
 * 指定された KeyboardEvent が指定された Hotkey と一致するかどうかを返します。
 * @param e KeyboardEventオブジェクト
 * @param hotkey Hotkeyオブジェクト
 * @returns KeyboardEventがHotkeyに一致する場合はtrue、それ以外の場合はfalse
 */
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

/**
 * 指定された設定ファイルを解析し、解析された設定情報をPrefオブジェクトとして返します。
 * 設定ファイルが正常に解析できなかった場合は、デフォルトの設定情報を使用します。
 * @param pref_json 解析する設定ファイルのJSON文字列
 * @param default_pref_json デフォルトの設定ファイルのJSON文字列
 * @returns 解析された設定情報を表すPrefオブジェクト
 */
export const parse_pref = function(pref_json:string,default_pref_json:string) : Pref{
    let pref = JSON.parse(pref_json)

    if(is_pref(pref) === false){
        pref = JSON.parse(default_pref_json) as Pref
    }

    return pref
}
