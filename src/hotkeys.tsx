import React from 'react'

/*
スコープの確認方法
配列の中にはHotkeyScapesのスタチックメンバが入ります

import { HotkeyScapes,Hotkey_Scape } from './hotkeys'
if([].includes(Hotkey_Scape.get()) == false) return


// 若干のタイムラグが欲しい
;(async () => {
    async function lag(){
        return new Promise((resolve) => {
            setTimeout(() => resolve(null),10)
        })
    }

    await lag()
    Hotkey_Scape.set(HotkeyScapes.Normal)
})()

*/



export class HotkeyScapes{
    static Normal = Symbol("normal")
    static Prompt = Symbol("prompt")
    static TagSelector = Symbol("tag-selector")    
    static LinkPrompt = Symbol('link-prompt')
    static LinkPromptWarningDialog = Symbol('link-prompt-warning-dialog')
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