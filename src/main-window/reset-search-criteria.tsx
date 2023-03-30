import React, { useEffect } from 'react'
import { Dispatch , SetStateAction} from 'react'
import { useState } from 'react'
import { HotkeyScapes,Hotkey_Scape } from './hotkeys'

export type ResetSearchCriteriaProps = {
    set_search_word:Dispatch<SetStateAction<string>>
    set_tag_ids:Dispatch<SetStateAction<number[]>>
    search_word_box:React.RefObject<HTMLInputElement>

    //>>>>>
    request:boolean
    set_request:Dispatch<SetStateAction<boolean>>
    //<<<<<
}

export const ResetSearchCriteria = (p:ResetSearchCriteriaProps) => {
    const reset = function(){
        p.set_search_word("")
        p.set_tag_ids([])
        p.search_word_box.current!.value = ""
    }

    const [reset_request,set_reset_request] = useState<boolean>(false)
    useEffect(() => {
        if(reset_request == false) return
        reset()
        set_reset_request(false)
    },[reset_request])

    //>>>>>
    useEffect(() => {
        if(p.request == false) return
        reset()
        p.set_request(false)
    },[p.request])
    //<<<<<

    useEffect(() => {
        document.addEventListener('keydown',(e) => {
            if([HotkeyScapes.Normal].includes(Hotkey_Scape.get()) == false) return
            if(
                e.altKey == false &&
                e.metaKey ==  false &&
                e.ctrlKey ==  true&&
                e.shiftKey ==  false){
                if(e.key == "r"){
                    set_reset_request(true)
                }
            }
        })
    },[])

    return (
        <div>
            <input type="button" value="reset search criteria (ctrl + r)" />
        </div>
    )
}
