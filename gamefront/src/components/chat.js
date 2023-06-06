import { useState } from "react";
import React from "react";

const Chat = (props) => {

    const [mensToSend, setMensToSend] = useState("");
    return(
        <div style={{whiteSpace: "pre-wrap"}}>
            <div>{props.mensagens}</div>
            <input type="text" value={mensToSend} onChange={(e) => {setMensToSend(e.target.value)}} />
            <button onClick={() => {props.sendMensage(mensToSend)}}>Send</button>
        </div>
    )
}

export default Chat;