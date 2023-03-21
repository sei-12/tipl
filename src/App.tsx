import React, { useEffect, useState } from 'react';
import './App.css';
import { Link } from './models/link';
import { Tag } from './models/tag';
import { fetch_parsed_link_data, fetch_parsed_tag_datas } from './test/decoy-data';

function App() {
	const [tags,set_tags] = useState<Tag[]>([])
	const [show_links,set_show_links] = useState<Link[]>([])
	const [links , set_links ] = useState<Link[]>([])
	const [focus_link,set_focus_link] = useState<Link | null> (null)

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

	return (
		<div className="App">

		</div>
	);
}

export default App;
