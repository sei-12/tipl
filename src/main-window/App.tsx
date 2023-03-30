import React, { useEffect, useState } from 'react';
import './App.css';
import { LinkEditor, LinkEditorProps } from './link-editor';
import { LinkFilter, LinkFilterProps } from './link-filter';
import { LinkList, LinkListProps } from './link-list';
import { Link } from '../models/link';
import { Tag } from '../models/tag';
import { useHotkeys } from 'react-hotkeys-hook'
import { Dispatch , SetStateAction} from 'react'
import { CreateNewTag,CreateNewTagProps } from './create-new-tag';
import { CreateNewLink, CreateNewLinkProps } from './create-new-link';
import { MoveFocus, MoveFocusProps } from './move-focus';
import { EditLinkBtn, EditLinkBtnProps } from './edit-link';
import { DeleteLink, DeleteLinkProps } from './delete-link';


let loaded_links = false
let loaded_tags = false

function App() {
	

	const [tags,set_tags] = useState<Tag[]>([])
	const [filted_links, set_filted_links] = useState<Link[]>([])
	const [links , set_links ] = useState<Link[]>([])
	const [focus_link_id,set_focus_link_id] = useState<number | null> (null)
	const [link_editor_is_show,set_link_editor_is_show] = useState<boolean>(false)

	//>>>>>
	const [reset_search_criteria_request,set_reset_search_criteria_request] = useState<boolean>(false)
	//<<<<<

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
		set_reset_search_criteria_request:set_reset_search_criteria_request,
		set_focus_link_id:set_focus_link_id,
		links:links,
		set_links:set_links,
		set_link_editor_is_show:set_link_editor_is_show
	}

	const link_filter_props : LinkFilterProps = {
		focus_link_id:focus_link_id,
		tags:tags,
		links:links,
		filted_links:filted_links,
		set_filted_links:set_filted_links,

		//>>>>>
		reset_search_criteria_request:reset_search_criteria_request,
		set_reset_search_criteria_request:set_reset_search_criteria_request
		//<<<<<
	}

	const edit_link_btn : EditLinkBtnProps = {
		set_link_editor_is_show:set_link_editor_is_show
	}

	const link_editor_props : LinkEditorProps = {
		is_show:link_editor_is_show,
		set_is_show:set_link_editor_is_show,
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

	const delete_link_props : DeleteLinkProps = {
		focus_link_id:focus_link_id,
		links:links,
		set_links:set_links,
		filted_links:filted_links,
		set_focus_id:set_focus_link_id
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
				<DeleteLink {...delete_link_props}/>				
				<CreateNewTag {...create_new_tag_props} />
				<CreateNewLink {...create_new_link_props}/>
				<LinkEditor {...link_editor_props} />
			</div>
			<div className='right'>
				<MoveFocus {...move_focus_props}/>
				<EditLinkBtn {...edit_link_btn} />
			<LinkList {...link_list_props} />
			</div>
		</div>
	);
}

export default App;
