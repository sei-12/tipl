import React, { useEffect, useRef } from 'react'
import { Dispatch , SetStateAction} from 'react'
import { useState } from 'react'
import { HotkeyScapes,Hotkey_Scape } from './hotkey-scape'
import { Hotkey, is_match_hotkey } from './models/hotkey'

export type ResetSearchCriteriaProps = {
    set_search_word:Dispatch<SetStateAction<string>>
    set_tag_ids:Dispatch<SetStateAction<number[]>>
    search_word_box:React.RefObject<HTMLInputElement>

    hotkey:Hotkey
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

    const hotkey = useRef(p.hotkey)

    useEffect(() => {
        document.addEventListener('keydown',(e) => {
            if([HotkeyScapes.Normal].includes(Hotkey_Scape.get()) == false) return
            if(is_match_hotkey(e,hotkey.current)){
                set_reset_request(true)
            }
        })
    },[])

    return (
        <div>
            <input type="button" value="reset search criteria (ctrl + r)" />
        </div>
    )
}
