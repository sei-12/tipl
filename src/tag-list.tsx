import React, { Dispatch, SetStateAction } from 'react'
import { Tag } from './models/tag'

type TagItemProps = {
    key:number
    data:Tag
}

const TagItem = (p:TagItemProps) => {
    return (
        <div>
            {p.data.title}
        </div>
    )
}

export type TagListProps = {
    tags:Tag[]
    show_tag_ids:number[]
    set_show_tag_ids:Dispatch<SetStateAction<number[]>>
}

export const TagList = (p:TagListProps) => {

    const put_show_tags = function(){
        return p.show_tag_ids.map( id => {
            // tagsはソートされてるから二分探索できる
            let tag = p.tags.find(tag => tag.ID == id)

            if(tag == undefined){ 
                throw Error("無効なIDが検出されました")
            }

            let props : TagItemProps = {
                key:tag.ID,
                data:tag
            }

            return (<TagItem {...props}/>)
        })
    }

    return (
        <div>
            {put_show_tags()}
        </div>
    )
}
