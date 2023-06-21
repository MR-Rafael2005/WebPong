import React from "react";
import { useContext } from "react";
import { GameContext, sendM, createRoom, leaveRoom, joinRoom } from "./gameContext.js";

const RoomsList = () => {
    const {isConnect, room, rooms, player, players, messages} = useContext(GameContext);
    
    return(
        <>
            <div className="list-group">
                <span className="list-title">
                    Salas:
                    {!player.room && <button onClick={() => {createRoom()}} >Criar Sala</button>}
                </span>
                {!player.room &&
                    <div>
                        {Object.keys(rooms).map((key) => 
                        <div key={key} className="list-item">
                            {rooms[key].name} 
                            
                            {rooms[key].score1 === undefined &&
                                <button onClick={() => {joinRoom(key)}} disabled={rooms[key].player1 && rooms[key].player2}>Entrar na Sala</button>
                            }   

                            {rooms[key].score1 !== undefined &&
                                <span>{rooms[key].score1} x {rooms[key].score2}</span> 
                            }
                        </div>)}
                    </div>
                }

                {player.room && rooms[player.room] &&
                    <div>
                        {rooms[player.room].player1 && rooms[player.room].player2 ?
                            <>
                                <button>INICIAR JOGO</button>
                            </> :
                            <>
                                <div className="list-item">
                                    <span>AGUARDANDO PLAYER...</span>
                                    <button onClick={() => {leaveRoom()}} >Sair da Sala</button>
                                </div>
                            </>
                        }
                    </div>
                }

            </div>
        </>
    )
}

export default RoomsList;