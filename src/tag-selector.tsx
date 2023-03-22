import React, { Dispatch, SetStateAction, useEffect, useRef, useState , ChangeEvent} from 'react'
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
        if(p.focus_item == null) return
        if(current_div.current == null) return

        let class_name = "focused-item"
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
		if(e.ctrlKey && e.key == "n"){
			cursor_down()
		}
		
		if(e.ctrlKey && e.key == "p"){
			cursor_up()
		}


		if(e.key == "Enter" && isComposing == false){
			p.set_is_show(false)
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

    const handle_change_search_word = function(e:ChangeEvent<HTMLInputElement>){
		// サーチワードが変わるとフォーカスは失われる
		set_focus_item(null)

		let search_words = e.target.value.split(" ")
        let filted_items_buf = filted_items;
		if(should_reset(search_words,last_search_words) == false){
            filted_items_buf = p.tags
        }

        search_words.forEach(word => {
			filted_items_buf = filted_items_buf.filter( tag => { 
				return tag.title.includes(word)
			})
		}) 

        set_last_search_words(search_words)
        set_filted_items([...filted_items_buf])
	}
    

    // todo rename ウィンドウを非表示にした後の処理
	const hide_window_process = () => {
        set_result()

        window_div.current!.style.display = "none"
		if(search_word_box.current != null){
			search_word_box.current!.value = ""
		}
		set_filted_items(p.tags)
	}

    const should_reset = function(new_words:string[],old_words:string[]){
        if(new_words.length > old_words.length) return false

        for(let i = 0 ; i < new_words.length; i++){
            if(new_words[i].includes(old_words[i]) == false){
                return false
            }
        }
        return true
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
    // 再レンダリングの必要なないがどうしたらいいのかわからない
    const [last_search_words,set_last_search_words] = useState([""])
    const search_word_box = useRef<HTMLInputElement>(null)
    const window_div = useRef<HTMLDivElement>(null)

    useEffect(() => {
		if(p.is_show){
			window_div.current!.style.display = "block"
			search_word_box.current!.focus()
		}else{
			hide_window_process()
		}
	},[p.is_show])

    useEffect(() => {
        set_filted_items([...p.tags])
    },[p.tags])


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
