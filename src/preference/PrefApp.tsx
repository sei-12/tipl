import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { parse_pref, Pref } from '../models/pref-model'

export const PreferenceApp = () => {
    const [pref,set_pref] = useState<Pref | null>(null)
    
    useEffect(() => {
        if( pref === null ) return
        window.prefAPI.save_pref_json(JSON.stringify(pref))
    },[pref])


    useEffect(() => {
        ;(async () =>{
            set_pref(parse_pref(...await window.prefAPI.load_pref_json()))
        })()
    },[])


    const test = function(){
        if( pref === null ) return
        console.log(pref)
        return (
            <div>
                {pref.focus_up.key}
            </div>
        )
    }

    return (
        <div>
            {test()}
            Hello Preference!!
        </div>
    )
}
