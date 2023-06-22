
import React from "react";
import { useContext, useState } from "react";
import PlayerList from "./playerList.js";
import Chat from "./chat.js";
import { GameContext, sendM, sendName } from "./gameContext.js";
import RoomsList from "./roomsList.js";
import Game from "./game.js";

const Pong = () => {

    const {isConnect, messages, match, playersName, named} = useContext(GameContext);
    const [nameToSend, setNameToSend] = useState("");

    const sendNameF = () => {
        sendName(nameToSend);
    }

    return(
        <>
            {
                !isConnect &&
                <footer>CONECTANDO...</footer>
            }
            
            {match.status && 
                <Game/>
            }
            
            {(!match.status && named) && 
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div className="list-container">
                        <RoomsList/>
                        <PlayerList playersList={playersName}/>
                    </div>
                    <Chat sendMensage={sendM} mensagens={messages}/>
                </div>
            }

            {(!match.status && !named) &&
                <div className="chat-container">
                    <div style={{position: "center"}}>
                        <h1>COLOQUE UM NOME DE USUÁRIO</h1>
                    </div>                    
                    <div className="chat-form">
                        <input type="text" value={nameToSend} onChange={(e) => {setNameToSend(e.target.value)}} />
                        <button onClick={() => {sendNameF()}} disabled={!nameToSend.trim()} className={!nameToSend.trim() && "disabled"}>Enviar</button>
                    </div>
                </div>
            }
        </>
    )
}

export default Pong;