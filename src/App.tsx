import React, { useEffect, useState } from 'react';
import './App.css';
import { LinkList, LinkListProps } from './link-items';
import { Link } from './models/link';
import { Tag } from './models/tag';
import { SearchWordInputBox, SearchWordInputBoxProps } from './search-word-input-box';
import { fetch_parsed_link_data, fetch_parsed_tag_datas } from './test/decoy-data';

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

	const search_word_input_box_props : SearchWordInputBoxProps = {
		links:links,
		filted_links:filted_links,
		set_filted_links:set_filted_links
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
			<SearchWordInputBox {...search_word_input_box_props}/>
			<LinkList {...link_list_props} />
		</div>
	);
}

export default App;
