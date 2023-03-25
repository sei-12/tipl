import React from 'react'

export class HotkeyScapes{
    static Normal = Symbol("normal")
    
}

class HotkeyScape{
    scape:symbol
    constructor(){
        this.scape = HotkeyScapes.Normal
    }

    get(){
        return this.scape
    }
}

export const Hotkey_Scape = new HotkeyScape()