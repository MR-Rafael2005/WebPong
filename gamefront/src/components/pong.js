
import React from "react";
import { useContext } from "react";
import PlayerList from "./playerList.js";
import Chat from "./chat.js";
import { GameContext, sendM, createRoom, leaveRoom, joinRoom } from "./gameContext.js";
import RoomsList from "./roomsList.js";
import Game from "./game.js";

const Pong = () => {

    const {isConnect, room, rooms, player, players, messages, match} = useContext(GameContext);
    return(
        <>
            {
                !isConnect &&
                <footer>CONECTANDO...</footer>
            }
            
            {match.status && 
                <Game/>
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