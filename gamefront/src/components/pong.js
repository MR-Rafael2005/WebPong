
import React from "react";
import { useContext } from "react";
import PlayerList from "./playerList.js";
import Chat from "./chat.js";
import { GameContext, sendM, createRoom, leaveRoom, joinRoom } from "./gameContext.js";

const Pong = () => {

    const {isConnect, room, rooms, player, players, messages} = useContext(GameContext);
    console.log(room)
    return(
        <>
            <div>
                        
                {!player.room &&
                    <div>
                        <button onClick={() => {createRoom()}} >Criar Sala</button>
                        {Object.keys(rooms).map((key) => <div key={key}>{rooms[key].name} <button onClick={() => {joinRoom(key)}} disabled={rooms[key].player1 && rooms[key].player2}>Entrar na Sala</button></div>)}
                    </div>
                }

                {player.room && rooms[player.room] &&
                    <div>
                        {rooms[player.room].player1 && rooms[player.room].player2 ?
                            <>
                                <button>INICIAR JOGO</button>
                            </> :
                            <>
                                AGUARDANDO OUTRO PLAYER...
                                <button onClick={() => {leaveRoom()}} >Sair da Sala</button>
                            </>
                        }
                    </div>
                }
            </div>

            {
                !isConnect &&
                <footer>CONECTANDO...</footer>
            }
            
            <div style={{display: "flex", flexDirection: "row"}}>
                <PlayerList playersList={players}/>
                <Chat sendMensage={sendM} mensagens={messages}/>
            </div>
        </>
    )
}

export default Pong;