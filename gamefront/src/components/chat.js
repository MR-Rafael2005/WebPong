import { useState } from "react";
import React from "react";

const Chat = (props) => {

    const [mensToSend, setMensToSend] = useState("");
    return(
        <div style={{flex: 1}}>
            <div style={{whiteSpace: "pre-wrap"}}>{props.mensagens}</div>
            <input type="text" value={mensToSend} onChange={(e) => {setMensToSend(e.target.value)}} />
            <button onClick={() => { if(mensToSend) {props.sendMensage(mensToSend); setMensToSend("")}}}>Send</button>
        </div>
    )
}

export default Chat;