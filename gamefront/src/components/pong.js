import React from "react";
import { useEffect, useState } from "react";
import socketClient from "socket.io-client";

const socket = socketClient("http://localhost:4000");

const Pong = () => {
    const [playersList, setPlyersList] = useState({});

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Conectado");
        })
    
        socket.on("PlayerUpdate", (newPlayers) => {
            setPlyersList(newPlayers);
        })
    })



    return(
        <div>
            {Object.keys(playersList).map((key) => { 
                return(
                    <div>{playersList[key].name}</div>
                )
            })}
        </div>
    )
}

export default Pong;