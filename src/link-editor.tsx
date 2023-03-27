import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import './link-editor.css'
import { Link } from './models/link'
import { Tag } from './models/tag'
import { TagList, TagListProps } from './tag-list'
import { TagSelectoor, TagSelectoorProps } from './tag-selector'
import { HotkeyScapes,Hotkey_Scape } from './hotkeys'
export type LinkEditorProps = {
    is_show:boolean
    set_is_show:Dispatch<SetStateAction<boolean>>
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
        p.set_is_show(false)
    }

    const hadnle_add_tag_btn = function(){
        if(p.focus_link_id == null) return
        set_tag_selector_is_show(true)
    }

    const [isComposing, setComposition] = useState(false);
    const startComposition = () => setComposition(true);
    const endComposition = () => setComposition(false);
    const current_div = useRef<HTMLDivElement>(null)
    const [can_save,set_can_save] = useState<boolean>(false)
    const [selected_tag_ids,set_selected_tag_ids] = useState<number[]>([])
    const title_input_box = useRef<HTMLInputElement>(null)
    const url_input_box = useRef<HTMLInputElement>(null)
    const [tag_selector_is_show,set_tag_selector_is_show] = useState<boolean>(false)
    const [tag_selector_result_id_buf,set_tag_selector_result_id_buf] = useState<number | null>(null)
    const [save_request,set_save_request] = useState<boolean>(false)
    const [add_tag_request,set_add_tag_request] = useState(false)

    const tag_list_props : TagListProps = {
        tags:p.tags,
        show_tag_ids:selected_tag_ids,
        set_show_tag_ids:set_selected_tag_ids
    }

    const tag_selector_props : TagSelectoorProps = {
        is_show:tag_selector_is_show,
        set_is_show:set_tag_selector_is_show,
        tags:p.tags,
        exclude_ids:selected_tag_ids,
        set_result_id_buf:set_tag_selector_result_id_buf
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

    useEffect(() => {
        if(tag_selector_result_id_buf == null)return
        set_selected_tag_ids([...selected_tag_ids,tag_selector_result_id_buf])
        set_tag_selector_result_id_buf(null)
    },[tag_selector_result_id_buf])

    useEffect(() => {
        if(title_input_box.current == null)return
        if(url_input_box.current == null)return

        if(title_input_box.current.value != "" && url_input_box.current.value != ""){
            set_can_save(true)
        }
    },[selected_tag_ids])

    useEffect(() => {
        document.addEventListener("keydown",(e) => {
            if([HotkeyScapes.LinkPrompt].includes(Hotkey_Scape.get()) == false) return

            if(
                e.altKey == false &&
                e.metaKey ==  false &&
                e.ctrlKey ==  false&&
                e.shiftKey ==  false){
                if(e.key == "Enter" && isComposing == false){
                    set_save_request(true)
                } 
            }

            if(
                e.altKey == false &&
                e.metaKey ==  false &&
                e.ctrlKey ==  true&&
                e.shiftKey ==  false){
                if(e.key == "3"){
                    set_add_tag_request(true)
                }
            }
        }) 
    },[])

    useEffect(() => {
        if(add_tag_request == false) return
        hadnle_add_tag_btn()
        set_add_tag_request(false)
    },[add_tag_request])

    useEffect(() => {
        if(save_request == false) return
        handle_save()
        set_save_request(false)
    },[save_request])

    useEffect(() => {
        if( current_div.current == null ) return
        if(p.is_show){
            if(p.focus_link_id == null) return
            Hotkey_Scape.set(HotkeyScapes.LinkPrompt)
            current_div.current.style.display = 'block'
        }else{
            current_div.current.style.display = 'none'

            ;(async () => {
                async function lag(){
                    return new Promise((resolve) => {
                        setTimeout(() => resolve(null),10)
                    })
                }
            
                await lag()
                Hotkey_Scape.set(HotkeyScapes.Normal)
            })()            
        }
    },[p.is_show])

    // ポップアップウィンドウ以外の場所をクリックしたら入力をキャンセル
    const outside_click_cancel = (e:Event) => {
        if( current_div.current == null ) return
        if( e.target != current_div.current) return
        handle_cancel()  
    }

    useEffect(() => {
        if( current_div.current == null ) return
        current_div.current.addEventListener("click",outside_click_cancel)
    },[])
    return (
        <div className='bg-filter' ></div>
            <input type="button" value="save (meta + s)" onClick={handle_save} /> <br />
            <input 
                type="text" 
                className='editor-input-box' 
                onChange={handle_onChange} 
                ref={title_input_box}
                onCompositionStart={startComposition}
                onCompositionEnd={endComposition}
            />
            <input 
                type="text" 
                className='editor-input-box' 
                onChange={handle_onChange} 
                ref={url_input_box}
                onCompositionStart={startComposition}
                onCompositionEnd={endComposition}
            />
            
            <br />
            <input type="button" value="add tag (ctrl + 4)" onClick={hadnle_add_tag_btn}/>
            <TagList {...tag_list_props}/>
            <TagSelectoor {...tag_selector_props}/>
        </div>
    )
}
