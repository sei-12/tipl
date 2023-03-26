import React from 'react'
import { Link } from './models/link'
import { Tag } from './models/tag'
import { useEffect } from 'react'
import { HotkeyScapes, Hotkey_Scape } from './hotkeys'
import { useState } from 'react'

export type OpenURLProps = {
    focus_link_id:number | null
    links:Link[]
    search_word:string
    filter_tag_ids:number[]
    tags:Tag[]
}

export const OpenURL = (p:OpenURLProps) => {

    const open_google_chrome = function(){
        let search_words = p.search_word.split(" ")
        let filter_tag_words = p.filter_tag_ids.map( id => p.tags.find(tag => tag.ID == id)!.title )
        window.electronAPI.open_google_chrome([...filter_tag_words,...search_words])
    }

    const open_url = function() {
        if(p.focus_link_id == null) return
        let url = p.links.find(link => link.ID == p.focus_link_id)!.url
        window.electronAPI.open_url(url)
    }

    const [open_request,set_open_request] = useState< string | null >(null)

    useEffect(() => {
        if(open_request == null) return

        if(open_request == "google"){
            open_google_chrome()
        }
        if(open_request == "url"){
            open_url()
        }
        set_open_request(null)
    },[open_request])
    

    useEffect(() => {
        document.addEventListener("keydown",(e) => {
            if([HotkeyScapes.Normal].includes(Hotkey_Scape.get()) == false) return

            if(
                e.altKey == false &&
                e.metaKey ==  false &&
                e.ctrlKey ==  false){
                if(e.key != "Enter") return
                if(e.shiftKey){
                    set_open_request("google")      
                }else{
                    set_open_request("url")
                }
            }
            
        })
    },[])
    return (
        <div>
            <input type="button" value="open url (Enter)" onClick={open_url} />
            <input type="button" value="open google chrome (shift + Enter)" onClick={open_google_chrome} />
        </div>
    )
}
