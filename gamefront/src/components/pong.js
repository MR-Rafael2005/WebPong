import React from "react";
import { useEffect } from "react";
import socketClient from "socket.io-client";

const socket = socketClient("http://localhost:4000");

const Pong = () => {

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Conectado");
        })
    })

    const players = {
        player1: {
            name: "PL1"
        },
        player2: {
            name: "PL2"
        }
    }

    return(
        <div>
            {Object.keys(players).map((key) => { 
                return(
                    <div>{players[key].name}</div>
                )
            })}
        </div>
    )
}

export default Pong;