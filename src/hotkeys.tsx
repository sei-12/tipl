import React from 'react'

/*
スコープの確認方法
配列の中にはHotkeyScapesのスタチックメンバが入ります

if([].includes(Hotkey_Scape.get()) == false)

*/



export class HotkeyScapes{
    static Normal = Symbol("normal")
    
}

export let Hotkey_Scape : symbol = HotkeyScapes.Normal