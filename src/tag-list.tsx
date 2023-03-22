import React, { Dispatch, SetStateAction } from 'react'
import { Tag } from './models/tag'

type TagItemProps = {

}

const TagItem = (p:TagItemProps) => {
    return (
        <div></div>
    )
}

export type TagListProps = {
    tag_ids:number[]
    set_tag_ids:Dispatch<SetStateAction<number[]>>
}

export const TagList = (p:TagListProps) => {
    return (
        <div></div>
    )
}
