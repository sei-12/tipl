import React, { Dispatch, SetStateAction } from 'react'
import { Tag } from './models/tag'

export type TagSelectoorProps = {
    is_show:boolean
    tags:Tag[]
    exclude_ids:number[]
    set_result_id_buf:Dispatch<SetStateAction<number | null>>
}

export const TagSelectoor = (p:TagSelectoorProps) => {
    return (
        <div></div>
    )
}
