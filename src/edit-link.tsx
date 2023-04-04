import React, { useRef } from 'react'
import { HotkeyScapes,Hotkey_Scape } from './hotkeys'
import { Dispatch , SetStateAction} from 'react'
import { useState,useEffect } from 'react'
import { Hotkey } from './models/hotkey'

export type EditLinkBtnProps = {
    set_link_editor_is_show:Dispatch<SetStateAction<boolean>>
    hotkey:Hotkey
}

export const EditLinkBtn = (p:EditLinkBtnProps) => {

    const [edit_request,set_edit_request] = useState<boolean>(false)
    const hotkey = useRef(p.hotkey)
    useEffect(() => {
        document.addEventListener("keydown",(e) => {
            if([HotkeyScapes.Normal].includes(Hotkey_Scape.get()) == false) return
            if(
                e.altKey == false &&
                e.metaKey ==  true &&
                e.ctrlKey ==  false&&
                e.shiftKey ==  false&&
                e.key == "e"){
                set_edit_request(true)
            }
        }) 
    },[])

    useEffect(() => {
        if( edit_request == false ) return
        
        p.set_link_editor_is_show(true)
        set_edit_request(false)        
    },[edit_request])

    return (
        <div>
            <input type="button" value="edit link (meta + e)" onClick={()=>{
                set_edit_request(true)
            }} />
        </div>
    )
}
