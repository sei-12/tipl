import { HashRouter, Routes, Route } from "react-router-dom";
import React from 'react'
import App from "./App";
import { Preference } from "./preference";

export const RootRoot = () => {
    return (
        <div>
            <HashRouter>
                <Routes>
                    <Route path='/' Component={App} />
                    <Route path="/pref" Component={Preference} />
                </Routes>
            </HashRouter>
        </div>
    )
}
