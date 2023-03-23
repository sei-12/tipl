import React, { Dispatch, SetStateAction } from 'react'
import './link-editor.css'
import { Link } from './models/link'
import { Tag } from './models/tag'

export type LinkEditorProps = {
    links:Link[]
    set_links:Dispatch<SetStateAction<Link[]>>
    tags:Tag[]
    set_tags:Dispatch<SetStateAction<Tag[]>>
    focus_link_id:number | null
}

export const LinkEditor = (p:LinkEditorProps) => {
    return (
        <div></div>
    )
}
