import React, { Dispatch, SetStateAction, useEffect, useRef, useState , ChangeEvent} from 'react'
import { HotkeyScapes, Hotkey_Scape } from './hotkey-scape'
import { Tag } from './models/tag'
import './tag-selector.css'

type TagSelectorItemProps = {
    key:number
    focus_item:Tag | null
    data:Tag
}

const TagSelectorItem = function(p:TagSelectorItemProps){

    const current_div = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        
        if(current_div.current == null) return
        let class_name = "focused-item"
        if(p.focus_item == null){
            current_div.current.classList.remove(class_name)
            return
        }
        if(p.focus_item.ID == p.data.ID){
            current_div.current.classList.add(class_name)
        }else{
            current_div.current.classList.remove(class_name)
        }

    },[p.focus_item])

    return (
        <div ref={current_div} className="item" >
            {p.data.title}
        </div>
    )
}

export type TagSelectoorProps = {
    is_show:boolean
    set_is_show:Dispatch<SetStateAction<boolean>>
    tags:Tag[]
    exclude_ids:number[]
    set_result_id_buf:Dispatch<SetStateAction<number | null>>
}

let last_scape : symbol | null = null
let last_search_word : string = ""

export const TagSelectoor = (p:TagSelectoorProps) => {
    const cursor_down = () => {
		if(filted_items.length == 0){
			return
		}

		let new_index = filted_items.findIndex(tag => tag == focus_item) + 1

		if(new_index == filted_items.length){
			new_index = 0
		}

        set_focus_item(filted_items[new_index])
	}

	const cursor_up = () => {
		if(filted_items.length == 0){
			return
		}
		let new_index = filted_items.findIndex(tag => tag == focus_item) - 1
		if(new_index < 0){
			new_index = filted_items.length - 1
		}
		set_focus_item( filted_items[new_index] )
	}

    const handle_onkeydown = function(e:React.KeyboardEvent<HTMLInputElement>){

        if(
            e.altKey == false &&
            e.metaKey ==  false &&
            e.ctrlKey ==  true&&
            e.shiftKey ==  false){
            
            if(e.key == "n"){
                cursor_down()
            }

            if(e.key == "p"){
                cursor_up()
            }
        }

        if(
            e.altKey == false &&
            e.metaKey ==  false &&
            e.ctrlKey ==  false&&
            e.shiftKey ==  false){
            if(e.key == "Enter" && isComposing == false){
                set_result()
                p.set_is_show(false)
            }
        }

        // Electronだとなぜかescでフォーカスが外れない
        if(e.key == "Escape"){
            search_word_box.current!.blur()
        }
	}

    const set_result = function(){
        if(focus_item == null){
            if(filted_items.length > 0){
                p.set_result_id_buf(filted_items[0].ID)
            }else{
                p.set_result_id_buf(null)
            }
            return
        }
        p.set_result_id_buf(focus_item.ID)
    }

    const wrap_set_filted_items = function(src_tags:Tag[],search_word:string){
        let filted_items_buf = src_tags;
        let search_words = search_word.split(" ")

        // 計算回数の少ない方法ではない
        p.exclude_ids.forEach(id => {
            filted_items_buf = filted_items_buf.filter(item => item.ID != id)
        })

        if(search_word != "") search_words.forEach(word => {
			filted_items_buf = filted_items_buf.filter( tag => { 
				return tag.title.includes(word)
			})
		})
        set_filted_items([...filted_items_buf])
    }

    const handle_change_search_word = function(e:ChangeEvent<HTMLInputElement>){
		// サーチワードが変わるとフォーカスは失われる
		set_focus_item(null)
        if(e.target.value.includes(last_search_word)){
            wrap_set_filted_items(filted_items,e.target.value)
        }else{
            wrap_set_filted_items(p.tags,e.target.value)
        }
        last_search_word = e.target.value
	}
    

    // todo rename ウィンドウを非表示にした後の処理
	const hide_window_process = () => {
        window_div.current!.style.display = "none"
		if(search_word_box.current != null){
			search_word_box.current!.value = ""
		}
		set_filted_items(p.tags)
        set_focus_item(null)
        // 若干のタイムラグが欲しい
        ;(async () => {
            async function lag(){
                return new Promise((resolve) => {
                    setTimeout(() => resolve(null),10)
                })
            }

            await lag()
            Hotkey_Scape.set(last_scape!)
            last_scape = null
        })()
	}

    const put_filted_items = function(){
        return filted_items.map( tag => (
            <TagSelectorItem
                key={tag.ID}
                data={tag}
                focus_item={focus_item}
            />
        ))
    }

    const [isComposing, setComposition] = useState(false);
	const startComposition = () => setComposition(true);
	const endComposition = () => setComposition(false);
    const [focus_item,set_focus_item] = useState<Tag|null>(null)
    const [filted_items,set_filted_items] = useState<Tag[]>([])
    const search_word_box = useRef<HTMLInputElement>(null)
    const window_div = useRef<HTMLDivElement>(null)

    useEffect(() => {
		if(p.is_show){
			window_div.current!.style.display = "block"
			search_word_box.current!.focus()
            wrap_set_filted_items(p.tags,"")
            last_scape = Hotkey_Scape.get()
            Hotkey_Scape.set(HotkeyScapes.TagSelector)
		}else{
			hide_window_process()
		}
	},[p.is_show])

    return (
        <div ref={window_div} className='tag-comp-window'>
            <div className="win-inner">

                <input type="text" className='input-search-word' 
                    ref={search_word_box} 
                    onChange={handle_change_search_word}
                    onKeyDown={handle_onkeydown}
                    onBlur={() => { p.set_is_show(false) }}
                    onCompositionStart={startComposition}
                    onCompositionEnd={endComposition}
                />
                {put_filted_items()}
            </div>
            
        </div>
    )
}
