import React, { useEffect, useState } from 'react';
import './App.css';
import { LinkEditor, LinkEditorProps } from './link-editor';
import { LinkFilter, LinkFilterProps } from './link-filter';
import { LinkList, LinkListProps } from './link-list';
import { Link } from './models/link';
import { Tag } from './models/tag';
import { useHotkeys } from 'react-hotkeys-hook'
import { Dispatch , SetStateAction} from 'react'
import { CreateNewTag,CreateNewTagProps } from './create-new-tag';
import { CreateNewLink, CreateNewLinkProps } from './create-new-link';
import { MoveFocus, MoveFocusProps } from './move-focus';


// type HotkeyProps = {
// 	filted_links:Link[]
// 	set_focus_link_id:Dispatch<SetStateAction<number | null>>
// 	focus_link_id:number | null
// }

// function Hotkey(p:HotkeyProps){
// 	const focus_up = () => {
// 		if(p.filted_links.length == 0){
// 			return
// 		}
// 		let new_index = p.filted_links.findIndex(tag => tag.ID == p.focus_link_id) - 1
// 		if(new_index < 0){
// 			new_index = p.filted_links.length - 1
// 		}
// 		p.set_focus_link_id( p.filted_links[new_index].ID )
// 	}

// 	const focus_down = () => {
// 		if(p.filted_links.length == 0){
// 			return
// 		}

// 		let new_index = p.filted_links.findIndex(tag => tag.ID == p.focus_link_id) + 1

// 		if(new_index == p.filted_links.length){
// 			new_index = 0
// 		}

//         p.set_focus_link_id(p.filted_links[new_index].ID)
// 	}
	
// 	useHotkeys('ctrl+n',focus_down)
// 	useHotkeys('ctrl+p',focus_up)
// 	useHotkeys('enter',() => console.log("press enter"))
// 	useHotkeys('shift+enter',() => console.log("open google"))

// 	return (
// 		<div></div>
// 	)
// }

let loaded_links = false
let loaded_tags = false

function App() {
	

	const [tags,set_tags] = useState<Tag[]>([])
	const [filted_links, set_filted_links] = useState<Link[]>([])
	const [links , set_links ] = useState<Link[]>([])
	const [focus_link_id,set_focus_link_id] = useState<number | null> (null)
	
	/// PROPS
	const link_list_props : LinkListProps = {
		focus_link_id:focus_link_id,
		set_focus_link_id:set_focus_link_id,
		list_up_links:filted_links
	}

	const create_new_tag_props : CreateNewTagProps = {
		set_tags:set_tags,
		tags:tags
	}

	const create_new_link_props : CreateNewLinkProps = {
		set_focus_link_id:set_focus_link_id,
		links:links,
		set_links:set_links
	}

	const link_filter_props : LinkFilterProps = {
		tags:tags,
		links:links,
		filted_links:filted_links,
		set_filted_links:set_filted_links
	}

	const link_editor_props : LinkEditorProps = {
		links:links,
		set_links:set_links,
		tags:tags,
		set_tags:set_tags,
		focus_link_id:focus_link_id
	}

	const move_focus_props : MoveFocusProps = {
		filted_links:filted_links,
		set_focus_link_id:set_focus_link_id,
		focus_link_id:focus_link_id
	}


	// DATA FILE
	useEffect(() => {
		if(loaded_links == false) return
		let links_json = JSON.stringify(links,null,4)
		window.electronAPI.save_links_json(links_json)
	},[links])

	useEffect(() => {
		if(loaded_tags == false) return
		let tags_json = JSON.stringify(tags,null,4)
		window.electronAPI.save_tags_json(tags_json)
	},[tags])


	useEffect(() => {
		(async () => {
			let datas = JSON.parse(await window.electronAPI.load_links_json()) as Link[]
			set_links([...datas])
			loaded_links = true
		})()
	},[])


	useEffect(() => {
		(async () => {
			let datas = JSON.parse(await window.electronAPI.load_tags_json()) as Tag[]
			set_tags([...datas])
			loaded_tags = true
		})()
	},[])

	useEffect(() => {
		set_focus_link_id(null)
	},[filted_links])

	return (
		<div className="App">
			
			<div className='left'>
				<LinkFilter {...link_filter_props}/>
				<CreateNewTag {...create_new_tag_props} />
				<CreateNewLink {...create_new_link_props}/>
				<LinkEditor {...link_editor_props} />
			</div>
			<div className='right'>
				<MoveFocus {...move_focus_props}/>
			<LinkList {...link_list_props} />
			</div>
		</div>
	);
}

export default App;
