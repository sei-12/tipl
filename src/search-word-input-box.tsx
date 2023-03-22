import React, { Dispatch, SetStateAction, useEffect, useRef ,ChangeEvent, useState} from "react";
import { Link } from "./models/link";
import { Tag } from "./models/tag";


export type SearchWordInputBoxProps = {
    links:Link[]
    tags:Tag[]
    set_filted_links:Dispatch<SetStateAction<Link[]>>
    filted_links:Link[]
}

export const SearchWordInputBox = function(p:SearchWordInputBoxProps){

    const should_reset = function(new_words:string[],old_words:string[]){
        if(new_words.length > old_words.length) return false

        for(let i = 0 ; i < new_words.length; i++){
            if(new_words[i].includes(old_words[i]) == false){
                return false
            }
        }
        return true
    }

    const handle_onchange = function(e:ChangeEvent<HTMLInputElement>){
        let search_words = e.target.value.split(" ")        
        let filted_links_buffer : Link[]

        if(should_reset(search_words,last_search_words)){
            filted_links_buffer = p.links
        }else{
            filted_links_buffer = p.filted_links
        }

        search_words.forEach(word => {
			filted_links_buffer = filted_links_buffer.filter( tag => { 
				return tag.title.includes(word)
			})
		}) 

        set_last_search_words(search_words)
        p.set_filted_links(filted_links_buffer)
    }

    const [last_search_words,set_last_search_words] = useState([""])

    return (
        <div>
            <input type="text" onChange={handle_onchange} />
        </div>
    )
}