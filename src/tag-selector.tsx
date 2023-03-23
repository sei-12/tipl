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
            set_result()
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
        set_last_search_word(e.target.value)
	}
    

    // todo rename ウィンドウを非表示にした後の処理
	const hide_window_process = () => {
        window_div.current!.style.display = "none"
		if(search_word_box.current != null){
			search_word_box.current!.value = ""
		}
		set_filted_items(p.tags)
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
    const [last_search_word,set_last_search_word] = useState("")
    const search_word_box = useRef<HTMLInputElement>(null)
    const window_div = useRef<HTMLDivElement>(null)

    useEffect(() => {
		if(p.is_show){
			window_div.current!.style.display = "block"
			search_word_box.current!.focus()
            wrap_set_filted_items(p.tags,"")
		}else{
			hide_window_process()
		}
	},[p.is_show])

    // useEffect(() => {
    //     wrap_set_filted_items("")
    // },[p.tags])


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
