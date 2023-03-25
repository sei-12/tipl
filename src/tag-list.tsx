import React, { Dispatch, SetStateAction ,useState, useRef, useEffect} from 'react'
import { Tag } from './models/tag'
import './tag-list.css'

type Position2D = {
    top_px:number
    left_px:number
}

type ContextMenuProps = {
    window_position:Position2D,
    is_show:boolean
    set_is_show:Dispatch<SetStateAction<boolean>>
    target_tag_id:number | null
    show_tag_ids:number[]
    set_show_tag_ids:Dispatch<SetStateAction<number[]>>
}

const ContextMenu = (p:ContextMenuProps) => {
    const handle_excludes = function(e:React.MouseEvent<HTMLInputElement>){
        let index = p.show_tag_ids.findIndex(id => id == p.target_tag_id)
        let buf = p.show_tag_ids
        buf.splice(index,1)
        p.set_show_tag_ids([...buf])

        p.set_is_show(false)
    }

    const current_div = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(current_div.current == null) return
        if(p.is_show){
            current_div.current.style.display = "block"
        }else{
            current_div.current.style.display = "none"
        }
    },[p.is_show])

    useEffect(() => {
        if(current_div.current == null) return
        current_div.current.style.top = p.window_position.top_px + "px"
        current_div.current.style.left = p.window_position.left_px + "px"
    },[p.window_position])

    useEffect(() => {
        document.addEventListener('click',() => p.set_is_show(false))
    },[])

    return (
        <div ref={current_div} className='context-menu'>
            <input type="button" value="excludes" onClick={handle_excludes}/>
        </div>
    )
}

type TagItemProps = {
    key:number
    data:Tag
    set_context_menu_is_show:Dispatch<SetStateAction<boolean>>
    set_context_menu_target_tag_id:Dispatch<SetStateAction<number|null>>
    set_context_menu_position:Dispatch<SetStateAction<Position2D>>
}

const TagItem = (p:TagItemProps) => {
    const handle_on_context_menu = function(e:React.MouseEvent<HTMLInputElement>){
        e.preventDefault()
        p.set_context_menu_target_tag_id(p.data.ID)
        p.set_context_menu_is_show(true)
        p.set_context_menu_position({top_px:e.clientY,left_px:e.clientX})
    }
    return (
        <div className="item" onContextMenu={handle_on_context_menu}>
            {p.data.title}
        </div>
    )
}

export type TagListProps = {
    tags:Tag[]
    show_tag_ids:number[]
    set_show_tag_ids:Dispatch<SetStateAction<number[]>>
}

export const TagList = (p:TagListProps) => {

    const put_show_tags = function(){
        return p.show_tag_ids.map( id => {
            // TODO:tagsはソートされてるから二分探索できる
            let tag = p.tags.find(tag => tag.ID == id)

            if(tag == undefined){ 
                throw Error("無効なIDが検出されました")
            }

            let props : TagItemProps = {
                key:tag.ID,
                data:tag,
                set_context_menu_target_tag_id:set_context_menu_target_tag_id,
                set_context_menu_is_show:set_context_menu_is_show,
                set_context_menu_position:set_context_menu_position
            }

            return (<TagItem {...props}/>)
        })
    }

    const [context_menu_is_show,set_context_menu_is_show] = useState<boolean>(false)
    const [context_menu_target_tag_id,set_context_menu_target_tag_id] = useState<number | null>(null)
    const [context_menu_position,set_context_menu_position] = useState<Position2D>({top_px:0,left_px:0})

    const context_menu_props : ContextMenuProps = {
        window_position:context_menu_position,
        is_show:context_menu_is_show,
        set_is_show:set_context_menu_is_show,
        target_tag_id:context_menu_target_tag_id,
        set_show_tag_ids:p.set_show_tag_ids,
        show_tag_ids:p.show_tag_ids
    }

    return (
        <div>
            {put_show_tags()}
            <ContextMenu {...context_menu_props}/>
        </div>
    )
}
