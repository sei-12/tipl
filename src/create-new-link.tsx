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
import { HotkeyScapes, Hotkey_Scape } from './hotkeys';
import { resolve } from 'path';


const next_id = function(links_tags:Link[] | Tag[]) : number{
    if(links_tags.length == 0)return 1
	return links_tags[links_tags.length - 1].ID + 1
}

export type CreateNewLinkProps = {
    links:Link[]
	set_links:Dispatch<SetStateAction<Link[]>>
	set_focus_link_id:Dispatch<SetStateAction<number | null>>
    set_link_editor_is_show:Dispatch<SetStateAction<boolean>>
}

export const CreateNewLink = (p:CreateNewLinkProps) => {
    
    const create_new_link = () => {
        set_create_reqest(true)
    }

    const [create_reqest,set_create_reqest] = useState<boolean>(false)

    useEffect(() => {
        if(create_reqest == false) return

        let id = next_id(p.links)
        let new_link : Link = {
            ID:id,
            title:"title",
            url:"url",
            tag_ids:[]
        }
        p.set_links([...p.links,new_link])

        // タイムラグをつけて実行しないとフォーカスされない
        ;(async () => {
            async function lag(){
                return new Promise((resolve) => {
                    setTimeout(() => resolve(null),10)
                })
            }

            await lag()
            p.set_focus_link_id(new_link.ID)
        })()
        // タイムラグをつけて実行しないとフォーカスされない
        ;(async () => {
            async function lag(){
                return new Promise((resolve) => {
                    setTimeout(() => resolve(null),10)
                })
            }

            await lag()
            p.set_link_editor_is_show(true)
        })()
        
        set_create_reqest(false)
    },[create_reqest])

    useEffect(() => {
        document.addEventListener("keydown",(e) => {
            // console.log(p) なぜかはわからないがこの時点でp.linksを参照しても空の配列
            if([HotkeyScapes.Normal].includes(Hotkey_Scape.get()) == false){
                return
            }

            if(
				e.metaKey && 
				e.shiftKey == false && 
				e.altKey == false && 
				e.ctrlKey == false && 
				e.key == "n"){
					create_new_link()
			}
        })
    },[])

    return (
        <div>
            <input type="button" value="create new link (meta+n)" onClick={create_new_link}  />
        </div>
    )
}
