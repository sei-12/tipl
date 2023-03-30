import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Link } from "../models/link";
import './link-list.css'
import { useState } from "react";

type LinkItemProps = {
    key:number
    focus_link_id:number | null
    set_focus_link_id:Dispatch<SetStateAction<number | null>>
    data:Link
    set_focus_item_offset_top:Dispatch<SetStateAction<number | null>>
} 


const LinkItem = function(p:LinkItemProps){
    
    const div_ref = useRef<HTMLDivElement>(null)

    const focus = function(){
        p.set_focus_link_id(p.data.ID)
    }

    const get_item_top_y = function():number{
        if( div_ref.current == null ) return 0
        return div_ref.current.offsetTop
    }

    useEffect(() => {
        if(p.focus_link_id == null){
            div_ref.current!.classList.remove('focus-item')
            return
        }

        if(p.focus_link_id == p.data.ID){
            div_ref.current!.classList.add('focus-item')
            p.set_focus_item_offset_top(get_item_top_y())
        }else{
            div_ref.current!.classList.remove('focus-item')
        }
    },[p.focus_link_id])

    return (
        <div className="item" ref={div_ref} onClick={focus}>
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
                set_focus_item_offset_top:set_focus_item_offset_top,
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

    const list_div = useRef<HTMLDivElement>(null)
    const [focus_item_offset_top,set_focus_item_offset_top] = useState<number | null>(null)
    // フォーカスしているリンクが表示されるように自動でスクロールする

    useEffect(() => {
        if( list_div.current == null ) return
        if( focus_item_offset_top == null ) return
        list_div.current.scrollTop = focus_item_offset_top - list_div.current.offsetTop
    },[focus_item_offset_top])
    
    useEffect(() => {
        if(p.focus_link_id == null){
            set_focus_item_offset_top(null)
        }
    },[p.focus_link_id])
    return (
        <div className="list-div" ref={list_div} >
            {map_links()}
        </div>
    )
}