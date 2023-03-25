import { Tag } from "./models/tag"
import { Dispatch , SetStateAction} from 'react'
import { Link } from "./models/link"
import { useState,useEffect } from "react"
import { Prompt,PromptProps } from "./prompt"
import { HotkeyScapes,Hotkey_Scape } from "./hotkeys"
import './create-new-tag.css'

export type CreateNewTagProps = {
	tags:Tag[]
	set_tags:Dispatch<SetStateAction<Tag[]>>
}

export const CreateNewTag = (p:CreateNewTagProps) => {
	const next_id = function(links_tags:Link[] | Tag[]) : number{
		return links_tags[links_tags.length - 1].ID + 1
	}



	const create_new_tag = () => {
		set_prompt_is_show(true)
	}

	const [prompt_is_show,set_prompt_is_show] = useState<boolean>(false)
	const [prompt_result_buf,set_prompt_result_buf] = useState<string|null>(null)
	const prompt_props : PromptProps = {
		is_show:prompt_is_show,
		set_is_show:set_prompt_is_show,
		message:"tag name",
		set_result_buf:set_prompt_result_buf
	}

	useEffect(() => {
		document.addEventListener("keydown",(e) => {
			if([HotkeyScapes.Normal].includes(Hotkey_Scape.get()) == false) return
			if(
				e.metaKey && 
				e.shiftKey && 
				e.altKey == false && 
				e.ctrlKey == false && 
				e.key == "n"){
					create_new_tag()
			}
		})	
	},[])

	useEffect(() => {
		if(prompt_result_buf == null || prompt_result_buf == "") return
		let id = next_id(p.tags)
		let new_tag : Tag = {
			ID:id,
			title:prompt_result_buf
		}
		p.set_tags([...p.tags,new_tag])
	},[prompt_result_buf])

	return (
		<div>
			<input type="button" value="create new tag (cmd+shift+n)" onClick={create_new_tag}/>
			<Prompt {...prompt_props}/>
		</div>
	)
}
