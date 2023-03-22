import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Link } from "./models/link";


type LinkItemProps = {
    key:number
    focus_link_id:number | null
    set_focus_link_id:Dispatch<SetStateAction<number | null>>
    data:Link
} 


const LinkItem = function(p:LinkItemProps){
    
    const div_ref = useRef<HTMLDivElement>(null)

    const focus = function(){
        p.set_focus_link_id(p.data.ID)
    }

    useEffect(() => {
        if(p.focus_link_id == null || p.focus_link_id != p.data.ID){
            div_ref.current!.classList.remove('focus-item')
        }else{
            div_ref.current!.classList.add('focus-item')
        }
    },[p.focus_link_id])

    return (
        <div ref={div_ref} onClick={focus}>
            {p.data.title}

        </div>
    )
}

export type LinkListProps = {
    focus_link_id:number | null
    set_focus_link_id:Dispatch<SetStateAction<number | null>>
    list_up_links:Link[]
}

export const LinkList = function( p : LinkListProps ){
    
    const map_links = function(){
        return p.list_up_links.map( link => {
            let props : LinkItemProps = {
                key:link.ID,
                focus_link_id:p.focus_link_id,
                set_focus_link_id:p.set_focus_link_id,
                data:link
            }

            return (
                <LinkItem {...props}/>
            )
        })
    }

    return (
        <div>
            {map_links()}
        </div>
    )
}