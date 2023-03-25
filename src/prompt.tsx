import React, { useEffect, useRef ,useState} from 'react'
import './prompt.css'
import { Dispatch , SetStateAction} from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside';

export type PromptProps = {
    is_show:boolean
    message:string
    set_is_show:Dispatch<SetStateAction<boolean>>
    set_result_buf:Dispatch<SetStateAction<string | null>>
}

export const Prompt = (p:PromptProps) => {

    const handle_cancel = function(){
        if(input_box.current == null){
            return
        }

        input_box.current.value = ""
        p.set_is_show(false)
    }

    const handle_done = function(){
        p.set_result_buf(input_box.current!.value)
        p.set_is_show(false)
    }

    const handle_input_box_onkeydown = function(e:React.KeyboardEvent<HTMLInputElement>){
        if(e.key == "Enter" && isComposing == false){
            p.set_is_show(false)
            p.set_result_buf(input_box.current!.value)
        }
    }

    const handle_document_click = () => {
        if(current_div.current == null) return
        if(should_handle_document_click == false) return
        p.set_is_show(false)
    }
    
    const [should_handle_document_click,set_should_handle_document_click] = useState<boolean>(false)
    const ref = useDetectClickOutside({ onTriggered: handle_document_click });
    const current_div = useRef<HTMLDivElement>(null)
    const input_box = useRef<HTMLInputElement>(null)

    const [isComposing, setComposition] = useState(false);
    const startComposition = () => setComposition(true);
    const endComposition = () => setComposition(false);


    useEffect(() => {
        if(current_div.current == null) return
        if(input_box.current == null )return
        if(p.is_show){
            p.set_result_buf(null)
            input_box.current.value = ""
            current_div.current.style.display = "block"

            input_box.current.focus()
            set_should_handle_document_click(true)
        }else{
            current_div.current.style.display = "none"
            set_should_handle_document_click(false)
        }
    },[p.is_show])

    useEffect(() => {
        document.addEventListener("click",handle_document_click)
    },[])

    return (
        <div ref={current_div} className="prompt-current">
            <div ref={ref} className="outer"> 
            <div className='inner'>
                <div>{p.message}</div>
                <input type="text" ref={input_box} onKeyDown={handle_input_box_onkeydown}
                    onCompositionStart={startComposition}
                    onCompositionEnd={endComposition}
                    size={30} />
                <br />
                <div className='btns' >
                    <input type="button" value="cancel" onClick={handle_cancel} />
                    <input type="button" value="done" className='done-btn' onClick={handle_done} />
                </div>
            </div>
            </div>
        </div>
    )
}
