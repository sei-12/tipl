import { HashRouter, Routes, Route } from "react-router-dom";
import React from 'react'
import App from "./App";
import { PreferenceApp } from "./preference/PrefApp";

export const RootRoot = () => {
    return (
        <div>
            <HashRouter>
                <Routes>
                    <Route path='/' Component={App} />
                    <Route path="/pref" Component={PreferenceApp} />
                </Routes>
            </HashRouter>
        </div>
    )
}
