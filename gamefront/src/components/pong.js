import React from "react";
import { useEffect, useState } from "react";
import socketClient from "socket.io-client";
import PlayerList from "./playerList.js";
import Chat from "./chat.js";

const socket = socketClient("http://localhost:4000");

const sendM = (mens) => {
    socket.emit("SendMessage", mens);
    console.log("Menssagem recebida");
}

const Pong = () => {
    const [playersList, setPlyersList] = useState({});
    const [allMessages, setAllMesages] = useState("");

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Conectado");
        })
    })

    useEffect(() => {
        socket.on("ReciMessage", (RecivedMessage) => {
            setAllMesages(allMessages + "\n" + RecivedMessage);
        })
    })

    useEffect(() => {
        socket.on("PlayerUpdate", (newPlayers) => {
            setPlyersList(newPlayers);
        }) 
    })

    return(
        <div style={{display: "flex", flexDirection: "row"}}>
            <PlayerList playersList={playersList}/>
            <Chat sendMensage={sendM} mensagens={allMessages}/>
        </div>
    )
}

export default Pong;