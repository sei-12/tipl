import React, { useEffect, useRef } from 'react'
import { Link } from './models/link'
import { Dispatch , SetStateAction} from 'react'
import { useState } from 'react'
import { Hotkey, is_match_hotkey } from './models/hotkey'

export type DeleteLinkProps = {
    focus_link_id:number | null
    set_focus_id:Dispatch<SetStateAction<number | null>>
    filted_links:Link[]
    links:Link[]
    set_links:Dispatch<SetStateAction<Link[]>>
    hotkey:Hotkey
}

export const DeleteLink = (p:DeleteLinkProps) => {

    const delete_link = function(){
        if( p.focus_link_id == null ) return
        let new_links = p.links.filter(link => link.ID != p.focus_link_id)

        p.set_links([...new_links])
    }

    const [delete_request,set_delete_request] = useState<boolean>(false)
    const hotkey = useRef(p.hotkey)

    useEffect(() => {
        if( delete_request == false ) return
        delete_link()
        set_delete_request(false)
    },[delete_request])

    useEffect(() => {
        document.addEventListener('keydown',(e:KeyboardEvent) => {
            if(is_match_hotkey(e,hotkey.current)){
                set_delete_request(true)
            }
        }) 
    },[])
    
    return (
        <div>
            <input type="button" value="delete link (cmd + d)" onClick={delete_link} />
        </div>
    )
}
