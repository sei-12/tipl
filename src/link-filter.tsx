import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { useState } from 'react'
import { Tag } from './models/tag'
import { TagList, TagListProps } from './tag-list'
import { TagSelectoor, TagSelectoorProps } from './tag-selector'
import { ChangeEvent } from 'react'
import { Link } from './models/link'


export type LinkFilterProps = {
    tags:Tag[]
    links:Link[]
    filted_links:Link[]
    set_filted_links:Dispatch<SetStateAction<Link[]>>
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

    const [search_word,set_search_word] = useState<string>("")
    const [filter_tag_ids,set_filter_tag_ids] = useState<number[]>([])
    const [tag_selector_is_show,set_tag_selector_is_show] = useState(false)
    const [tag_selector_result_buf,set_tag_selector_result_buf] = useState<number | null>(null)


    const [last_search_word,set_last_search_word] = useState<string>("")
    const [last_tag_ids,set_last_tag_ids] = useState<number[]>([])

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

    useEffect(() => {
        if(tag_selector_result_buf == null)return
        set_filter_tag_ids([...filter_tag_ids,tag_selector_result_buf])
        set_tag_selector_result_buf(null)
    },[tag_selector_result_buf])

    
    useEffect(() => {
        // last_filtertag_idsが思うように動作しないため仕方なく
        // 
        wrap_set_filted_links(p.links)

        set_last_search_word(search_word)
        set_last_tag_ids(filter_tag_ids)
    },[search_word,filter_tag_ids])

    useEffect(() => {
        wrap_set_filted_links(p.links)
    },[p.links])

    return (
        <div>
            <input type="text" onChange={(e)=>set_search_word(e.target.value)} /> <br />
            <input type="button" value="add tag" onClick={ () => { set_tag_selector_is_show(true) }} />
            <TagList {...tag_list_props}/>
            <TagSelectoor {...tag_selector_props}/>
        </div>
    )
}
