import React, { useEffect } from 'react'
import { Link } from './models/link'
import { Dispatch , SetStateAction} from 'react'
import { useState } from 'react'

export type DeleteLinkProps = {
    focus_link_id:number | null
    set_focus_id:Dispatch<SetStateAction<number | null>>
    filted_links:Link[]
    links:Link[]
    set_links:Dispatch<SetStateAction<Link[]>>
}

export const DeleteLink = (p:DeleteLinkProps) => {

    // linksが更新されると検索条件がクリアされてしまう
    // const calc_next_focus_id = function() : number{
    //     let index = p.filted_links.findIndex(link => link.ID == p.focus_link_id) - 1
    //     if(index < 0){
    //         index = 0
    //     }
    //     return p.filted_links[index].ID
    // }

    const delete_link = function(){
        if( p.focus_link_id == null ) return
        let new_links = p.links.filter(link => link.ID != p.focus_link_id)

        p.set_links([...new_links])
    }

    const [delete_request,set_delete_request] = useState<boolean>(false)

    const hotkey = (e:KeyboardEvent) => {
        console.log(e.key)
        if(
            e.altKey == false &&
            e.metaKey ==  true &&
            e.ctrlKey ==  false&&
            e.shiftKey ==  false &&
            e.key == "Backspace"){
            set_delete_request(true)
        }
    }

    useEffect(() => {
        if( delete_request == false ) return
        delete_link()
        set_delete_request(false)
    },[delete_request])

    useEffect(() => {
       document.addEventListener('keydown',hotkey) 
    },[])
    return (
        <div>
            <input type="button" value="delete link (meta + backspace)" onClick={delete_link} />
        </div>
    )
}
