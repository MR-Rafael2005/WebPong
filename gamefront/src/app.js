import React from "react";
import Pong from "./components/pong.js";
import { GameProvider } from "./components/gameContext";
import GlobalStyle from "./styleGlobal";

export default function App()
{
    return(
        <>
            <GlobalStyle/>
            <div className="main-container">
                <GameProvider>
                    <Pong/>
                </GameProvider>
            </div>
        </>
    )
}