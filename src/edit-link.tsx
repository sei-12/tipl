import React from 'react'
import { HotkeyScapes,Hotkey_Scape } from './hotkeys'
import { Dispatch , SetStateAction} from 'react'
import { useState,useEffect } from 'react'

export type EditLinkBtnProps = {
    set_link_editor_is_show:Dispatch<SetStateAction<boolean>>
}

export const EditLinkBtn = (p:EditLinkBtnProps) => {

    const [edit_request,set_edit_request] = useState<boolean>(false)

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
    },[edit_request])

    return (
        <div>
            <input type="button" value="edit link (meta + e)" onClick={()=>{
                set_edit_request(true)
            }} />
        </div>
    )
}
