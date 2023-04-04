import React ,{useEffect,useRef,useState} from 'react'
import { Link } from './models/link'
import { Dispatch , SetStateAction} from 'react'
import { HotkeyScapes, Hotkey_Scape } from './hotkey-scape'
import './move-focus.css'
import { Hotkey, is_match_hotkey } from './models/hotkey'
export type MoveFocusProps = {
    filted_links:Link[],
    set_focus_link_id:Dispatch<SetStateAction<number | null>>
	focus_link_id:number | null
    hotkeys:{
        focus_up_hotkey:Hotkey
        focus_down_hotkey:Hotkey
    }
}

export const MoveFocus = (p:MoveFocusProps) => {
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

    const [move_focus_request,set_move_focus_request] = useState<string | null>(null)

    useEffect(() => {
        if(move_focus_request == null) return
        if(move_focus_request == "n"){
            focus_down()
        }
        if(move_focus_request == "p"){
            focus_up()
        }
        set_move_focus_request(null)
    },[move_focus_request])

    const hotkeys = useRef(p.hotkeys)

    useEffect(() => {
        document.addEventListener("keydown",(e) => {
            if([HotkeyScapes.Normal].includes(Hotkey_Scape.get()) == false) return
    
            if(is_match_hotkey(e,hotkeys.current.focus_down_hotkey)){
                set_move_focus_request("n")
                return
            }
            if(is_match_hotkey(e,hotkeys.current.focus_up_hotkey)){
                set_move_focus_request("p")
                return
            }
        })
    },[])

    return (
        <div>
            <input type="button" className='move-focus-btn' value="focus up (ctrl + p)" onClick={focus_up} />
            <input type="button" className='move-focus-btn' value="focus down (ctrl + n)" onClick={focus_down} />
        </div>
    )
}
