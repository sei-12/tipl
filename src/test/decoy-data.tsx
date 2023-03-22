import { Tag } from "../models/tag"
import { Link } from "../models/link"

const lag = async function(){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null)
        },1000)
    })

}

export const fetch_parsed_link_data = async function(){
    await lag()

    let items : Link[] = [
        {ID:0 ,title:"hello"   ,tag_ids:[2,1],url:"url1"},
        {ID:1 ,title:"two"     ,tag_ids:[1,2],url:"2"},
        {ID:3 ,title:"three"   ,tag_ids:[3,1],url:"これはurlf3"},
        {ID:5 ,title:"aaa"     ,tag_ids:[1,2],url:"これはurlf4"},
        {ID:6 ,title:"six"     ,tag_ids:[2]  ,url:"これはurlf5"},
        {ID:7 ,title:"saa"     ,tag_ids:[1,2],url:"これはurlf6"},
        {ID:8 ,title:"aalfdskj",tag_ids:[0,1],url:"これはurlf7"},
        {ID:9 ,title:"nine"    ,tag_ids:[0,3],url:"これはurlf8"},
        {ID:10,title:"ten"     ,tag_ids:[0]  ,url:"これはurlf9"},
        {ID:11,title:"goo"     ,tag_ids:[0,2],url:"これはurlf10"},
        {ID:18,title:"aaaadf"  ,tag_ids:[2,3],url:"これはurlf11"},
    ]

    return items
}


export const fetch_parsed_tag_datas = async function(){
    await lag()

    let tags : Tag[] = [
        {ID:0,title:"hello"},
        {ID:1,title:"num"},
        {ID:2,title:"str"},
        {ID:3,title:"long"},
    ]

    return tags
}