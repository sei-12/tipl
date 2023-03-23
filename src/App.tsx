import React, { useEffect, useState } from 'react';
import './App.css';
import { LinkEditor, LinkEditorProps } from './link-editor';
import { LinkFilter, LinkFilterProps } from './link-filter';
import { LinkList, LinkListProps } from './link-list';
import { Link } from './models/link';
import { Tag } from './models/tag';
import { fetch_parsed_link_data, fetch_parsed_tag_datas } from './test/decoy-data';
import { useHotkeys } from 'react-hotkeys-hook'
import { Dispatch , SetStateAction} from 'react'

type HotkeyProps = {
	filted_links:Link[]
	set_focus_link_id:Dispatch<SetStateAction<number | null>>
	focus_link_id:number | null
}

function Hotkey(p:HotkeyProps){
	const focus_up = () => {
		if(p.filted_links.length == 0){
			return
		}
		let new_index = p.filted_links.findIndex(tag => tag.ID == p.focus_link_id) - 1
		if(new_index < 0){
			new_index = p.filted_links.length - 1
		}
		p.set_focus_link_id( p.filted_links[new_index].ID )
	}

	const focus_down = () => {
		if(p.filted_links.length == 0){
			return
		}

		let new_index = p.filted_links.findIndex(tag => tag.ID == p.focus_link_id) + 1

		if(new_index == p.filted_links.length){
			new_index = 0
		}

        p.set_focus_link_id(p.filted_links[new_index].ID)
	}
	
	useHotkeys('ctrl+n',focus_down)
	useHotkeys('ctrl+p',focus_up)
	useHotkeys('enter',() => console.log("press enter"))
	useHotkeys('shift+enter',() => console.log("open google"))

	return (
		<div></div>
	)
}

function App() {
	

	const [tags,set_tags] = useState<Tag[]>([])
	const [filted_links, set_filted_links] = useState<Link[]>([])
	const [links , set_links ] = useState<Link[]>([])
	const [focus_link_id,set_focus_link_id] = useState<number | null> (null)

	const link_list_props : LinkListProps = {
		focus_link_id:focus_link_id,
		set_focus_link_id:set_focus_link_id,
		list_up_links:filted_links
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

	const hotkey_props : HotkeyProps = {
		filted_links:filted_links,
		set_focus_link_id:set_focus_link_id,
		focus_link_id:focus_link_id
	}

	

	useEffect(() => {
		(async () => {
			set_links( await fetch_parsed_link_data() )
		})()
	},[])


	useEffect(() => {
		(async () => {
			set_tags( await fetch_parsed_tag_datas() )
		})()
	},[])

	useEffect(() => {
		set_focus_link_id(null)
	},[filted_links])

	return (
		<div className="App">
			<Hotkey {...hotkey_props}/>
			<div className='left'>
				<LinkFilter {...link_filter_props}/>
				<LinkEditor {...link_editor_props} />
			</div>
			<div className='right'>
			<LinkList {...link_list_props} />
			</div>
		</div>
	);
}

export default App;
