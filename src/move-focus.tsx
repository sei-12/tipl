import React ,{useEffect,useState} from 'react'
import { Link } from './models/link'
import { Dispatch , SetStateAction} from 'react'
import { HotkeyScapes, Hotkey_Scape } from './hotkeys'

export type MoveFocusProps = {
    filted_links:Link[],
    set_focus_link_id:Dispatch<SetStateAction<number | null>>
	focus_link_id:number | null
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

    useEffect(() => {
        document.addEventListener("keydown",(e) => {
            if([HotkeyScapes.Normal].includes(Hotkey_Scape.get()) == false) return

            if(
                e.altKey == false &&
                e.metaKey == false &&
                e.ctrlKey &&
                e.shiftKey == false){

                if(e.key == "n"){
                    set_move_focus_request("n")
                }
                if(e.key == "p"){
                    set_move_focus_request("p")
                }
            }
        })
    },[])

    return (
        <div>
            <input type="button" value="focus up (ctrl + p)" onClick={focus_up} />
            <input type="button" value="focus down (ctrl + n)" onClick={focus_down} />
        </div>
    )
}
