import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import './link-editor.css'
import { Link } from './models/link'
import { Tag } from './models/tag'
import { TagList, TagListProps } from './tag-list'

export type LinkEditorProps = {
    links:Link[]
    set_links:Dispatch<SetStateAction<Link[]>>
    tags:Tag[]
    set_tags:Dispatch<SetStateAction<Tag[]>>
    focus_link_id:number | null
}

export const LinkEditor = (p:LinkEditorProps) => {
    const handle_onChange = function(e:ChangeEvent<HTMLInputElement>){
        if(e.target.value == ""){
            set_can_save(false)
            e.target.classList.add('warning')
        }else{
            set_can_save(true)
            e.target.classList.remove('warning')
        }
    }

    const handle_save = function(){
        if(p.focus_link_id == null){
            return
        }

        if(can_save == false){
            return
        }

        let buf = p.links
        let index = buf.findIndex(link => link.ID == p.focus_link_id)

        if(index == -1) throw Error("あり得ない条件分岐")

        buf[index].title = title_input_box.current!.value
        buf[index].url = url_input_box.current!.value
        buf[index].tag_ids = selected_tag_ids

        p.set_links([...buf])
    }
    
    const [can_save,set_can_save] = useState<boolean>(false)
    const [selected_tag_ids,set_selected_tag_ids] = useState<number[]>([])
    const title_input_box = useRef<HTMLInputElement>(null)
    const url_input_box = useRef<HTMLInputElement>(null)
  
    const tag_list_props : TagListProps = {
        tags:p.tags,
        show_tag_ids:selected_tag_ids,
        set_show_tag_ids:set_selected_tag_ids
    }

    useEffect(() => {
        if(p.focus_link_id == null){
            title_input_box.current!.value = ""
            url_input_box.current!.value = ""
            set_selected_tag_ids([])
        }else{
            let link = p.links.find(link => link.ID == p.focus_link_id)
            if(link == undefined) throw Error("バグ")
            title_input_box.current!.value = link.title
            url_input_box.current!.value = link.url
            set_selected_tag_ids([...link.tag_ids])
        }
    },[p.focus_link_id])

    return (
        <div>
            <input type="button" value="save" onClick={handle_save} /> <br />
            <input type="text" onChange={handle_onChange} ref={title_input_box}
            />
            <input type="text" onChange={handle_onChange} ref={url_input_box}
            />
            <TagList {...tag_list_props}/>
        </div>
    )
}
