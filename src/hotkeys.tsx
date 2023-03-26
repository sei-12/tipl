import React from 'react'

/*
スコープの確認方法
配列の中にはHotkeyScapesのスタチックメンバが入ります

if([].includes(Hotkey_Scape.get()) == false)

*/



export class HotkeyScapes{
    static Normal = Symbol("normal")
    static TagSelector = Symbol("tag-selector")    
}

class HotkeyScape{
    scape:symbol

    constructor(){
        this.scape = HotkeyScapes.Normal
    }

    get(){
        return this.scape
    }

    set(scape:symbol){
        this.scape = scape
    }
}

export const Hotkey_Scape = new HotkeyScape()