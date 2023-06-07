import React from "react";
import "./app.css"
import Pong from "./components/pong.js";
import { GameProvider } from "./components/gameContext";
import GlobalStyle from "./styleGlobal";

export default function App()
{
    return(
        <GameProvider>
            <GlobalStyle/>
            <Pong/>
        </GameProvider>
    )
}