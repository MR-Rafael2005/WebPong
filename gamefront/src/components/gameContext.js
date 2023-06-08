import React, { useEffect, useReducer } from "react";
import socketClient from "socket.io-client";

const socket = socketClient("http://localhost:4000",{
    autoConnect: false,
})

const GameContext = React.createContext();

const sendM = (mens) => {
    socket.emit("SendMessage", mens);
    console.log("Menssagem envada");
}

const createRoom = () => {
    socket.emit("CreateRoom");
}

const leaveRoom = () => {
    socket.emit("LeaveRoom");
}

const joinRoom = (roomID) => {
    socket.emit("JoinRoom", roomID);
}

const reducer = (state, change) => {
    switch (change.type) {
        case "CONNECT":
            return({
                ...state,
                isConnect: change.newvalue
            })
        case "DISCONNECT":
            return({
                ...state,
                isConnect: change.newvalue
            })
        case "MESSAGE":
            return({
                ...state,
                messages: [ change.newvalue]
            })
        case "PLAYER" :
            return({
                ...state,
                player: change.newvalue
            })
        case "PLAYERS":
            return({
                ...state,
                players: change.newvalue
            })
        case "ROOM":
            return({
                ...state,
                room: state.rooms[state.players[change.newvalue].room]
            })
        case "ROOMS":
            return({
                ...state,
                rooms: change.newvalue
            })
        case "MATCH":
            return({
                ...state,
                match: change.newvalue
            })
        default:
            return state
    }
}

const initialState = {
    isConnect: false,
    room: {},
    rooms: {},
    player: {},
    players: {},
    messages: [],
    match: {}
}

const GameProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        socket.on("connect", () => {
            dispatch({type: "CONNECT", newvalue: true});
        })
        socket.on("disconnect", () => {

            dispatch({type: "DISCONNECT", newvalue: false});
        })
        socket.on("ReciMessage", (message) => {
            dispatch({type: "MESSAGE", newvalue: state.messages + message + "\n"});
        })
        socket.on("PlayerUpdate", (newPlayers) => {
            dispatch({type: "PLAYERS", newvalue: newPlayers});
            dispatch({type: "PLAYER", newvalue: newPlayers[socket.id]})
        })
        socket.on("RoomsUpdate", (rooms) => {
            dispatch({type: "ROOMS", newvalue: rooms})
            dispatch({type: "ROOM", newvalue: socket.id})
        })
        socket.on("MatchUpdate", (match) => {
            dispatch({type: "MATCH", newvalue: match})
        })
        socket.open();
    })
    
    return(
        <GameContext.Provider value={ state }>
            {props.children}
        </GameContext.Provider>
    )
}

export { GameContext, GameProvider, sendM, createRoom, leaveRoom, joinRoom }