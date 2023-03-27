import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import './link-filter.css'
import { useState } from 'react'
import { Tag } from './models/tag'
import { TagList, TagListProps } from './tag-list'
import { TagSelectoor, TagSelectoorProps } from './tag-selector'
import { ChangeEvent } from 'react'
import { Link } from './models/link'
import { OpenURL, OpenURLProps } from './open-url'
import { HotkeyScapes , Hotkey_Scape } from './hotkeys'
import { ResetSearchCriteria, ResetSearchCriteriaProps } from './reset-search-criteria'

export type LinkFilterProps = {
    tags:Tag[]
    links:Link[]
    filted_links:Link[]
    set_filted_links:Dispatch<SetStateAction<Link[]>>
    focus_link_id:number | null

    //>>>>>
    reset_search_criteria_request:boolean
    set_reset_search_criteria_request:Dispatch<SetStateAction<boolean>>
    //<<<<<
}

export const LinkFilter = (p:LinkFilterProps) => {

    const wrap_set_filted_links = function(filted_links:Link[]){
        let calc_count = 0
        let search_words = search_word.split(" ")

        filter_tag_ids.forEach( id => {
            filted_links = filted_links.filter(link => {
                calc_count++
                return link.tag_ids.includes(id)
            })
        })

        if(search_word != "") search_words.forEach( word => {
            filted_links = filted_links.filter(link=>{
                calc_count++
                return link.title.includes(word)
            })
        })

        p.set_filted_links(filted_links)
    }

    const focus_search_word_box = () => {
        if(search_word_box.current == null)return

        search_word_box.current.focus()
    }

    const search_word_box = useRef<HTMLInputElement>(null)
    const [search_word,set_search_word] = useState<string>("")
    const [filter_tag_ids,set_filter_tag_ids] = useState<number[]>([])
    const [tag_selector_is_show,set_tag_selector_is_show] = useState(false)
    const [tag_selector_result_buf,set_tag_selector_result_buf] = useState<number | null>(null)

    const tag_list_props : TagListProps = {
        tags:p.tags,
        show_tag_ids:filter_tag_ids,
        set_show_tag_ids:set_filter_tag_ids
    }

    const tag_selector_props : TagSelectoorProps = {
        is_show:tag_selector_is_show,
        set_is_show:set_tag_selector_is_show,
        tags:p.tags,
        exclude_ids:filter_tag_ids,
        set_result_id_buf:set_tag_selector_result_buf
    }

    const open_url_props : OpenURLProps = {
        focus_link_id:p.focus_link_id,
        links:p.links,
        search_word:search_word,
        filter_tag_ids:filter_tag_ids,
        tags:p.tags
    }

    const reset_search_criteria_props : ResetSearchCriteriaProps = {
        set_search_word:set_search_word,
        set_tag_ids:set_filter_tag_ids,
        search_word_box:search_word_box,

        //>>>>>
        request:p.reset_search_criteria_request,
        set_request:p.set_reset_search_criteria_request
        //<<<<<
    }

    useEffect(() => {
        document.addEventListener("keydown",(e) => {
            if([HotkeyScapes.Normal].includes(Hotkey_Scape.get()) == false) return
            if(
                e.altKey == false &&
                e.metaKey ==  false &&
                e.ctrlKey ==  true&&
                e.shiftKey ==  false){
                if(e.key == "/"){
                    focus_search_word_box()
                }
                if(e.key == "3"){
                    set_tag_selector_is_show(true)
                }
            }
        })

    },[])
    useEffect(() => {
        if(tag_selector_result_buf == null)return
        set_filter_tag_ids([...filter_tag_ids,tag_selector_result_buf])
        set_tag_selector_result_buf(null)
    },[tag_selector_result_buf])

    
    useEffect(() => {
        // last_filtertag_idsが思うように動作しないため仕方なく
        // 
        wrap_set_filted_links(p.links)
    },[search_word,filter_tag_ids])

    useEffect(() => {
        wrap_set_filted_links(p.links)
    },[p.links])

    return (
        <div className='link-filter'>
            <OpenURL {...open_url_props} />
            <ResetSearchCriteria {...reset_search_criteria_props} />
            <input type="text" className='input-search-word-box' ref={search_word_box} onChange={(e)=>set_search_word(e.target.value)} placeholder="ctrl + /"/> <br />
            <input type="button" value="add tag (ctrl + 3)" onClick={ () => { set_tag_selector_is_show(true) }} />
            <TagList {...tag_list_props}/>
            <TagSelectoor {...tag_selector_props}/>
        </div>
    )
}
