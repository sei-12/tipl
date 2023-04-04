import { Tag } from "./models/tag"
import { Dispatch , SetStateAction, useRef} from 'react'
import { Link } from "./models/link"
import { useState,useEffect } from "react"
import { Prompt,PromptProps } from "./prompt"
import { HotkeyScapes,Hotkey_Scape } from "./hotkeys"
import './create-new-tag.css'
import { Hotkey, is_match_hotkey } from "./models/hotkey"

export type CreateNewTagProps = {
	tags:Tag[]
	set_tags:Dispatch<SetStateAction<Tag[]>>
	hotkey:Hotkey
}

export const CreateNewTag = (p:CreateNewTagProps) => {
	const next_id = function(links_tags:Link[] | Tag[]) : number{
		if(links_tags.length == 0)return 1
		return links_tags[links_tags.length - 1].ID + 1
	}

	const tag_exists = function(tag_title:string) : boolean{
		if(p.tags.findIndex(tag => tag.title == tag_title) == -1){
			return false
		}else{
			return true
		}
	}


	const create_new_tag = () => {
		set_prompt_is_show(true)
	}

	const hotkey = useRef(p.hotkey)
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
			if(is_match_hotkey(e,hotkey.current)){
				create_new_tag()
			}
		})	
	},[])

	useEffect(() => {
		if(prompt_result_buf == null || prompt_result_buf == "") return
		
		if(tag_exists(prompt_result_buf)){
			alert(prompt_result_buf + "はすでに存在します")
			return
		}

		let id = next_id(p.tags)
		let new_tag : Tag = {
			ID:id,
			title:prompt_result_buf
		}
		p.set_tags([...p.tags,new_tag])
	},[prompt_result_buf])

	useEffect(() => {
		if(prompt_is_show){
			Hotkey_Scape.set(HotkeyScapes.Prompt)
		}else{
			// 若干のタイムラグが欲しい
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
	},[prompt_is_show])

	return (
		<div>
			<input type="button" value="create new tag (cmd+shift+n)" onClick={create_new_tag}/>
			<Prompt {...prompt_props}/>
		</div>
	)
}
