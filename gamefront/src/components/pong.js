
import React from "react";
import { useContext } from "react";
import PlayerList from "./playerList.js";
import Chat from "./chat.js";
import { GameContext, sendM, createRoom, leaveRoom, joinRoom } from "./gameContext.js";
import RoomsList from "./roomsList.js";

const Pong = () => {

    const {isConnect, room, rooms, player, players, messages, match} = useContext(GameContext);

    console.log(room)
    return(
        <>
            {
                !isConnect &&
                <footer>CONECTANDO...</footer>
            }
            
            {match.status && 
                <div>JOGO</div>
            }
            
            {!match.status &&
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div className="list-container">
                        <RoomsList/>
                        <PlayerList playersList={players}/>
                    </div>
                    <Chat sendMensage={sendM} mensagens={messages}/>
                </div>
            }
        </>
    )
}

export default Pong;