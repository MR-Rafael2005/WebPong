import { useState, useEffect } from "react";
import React from "react";

const Chat = (props) => {
    const [mensToSend, setMensToSend] = useState("");

        
    const sendMessage = () => {
        if(mensToSend) 
        {
            props.sendMensage(mensToSend); 
            setMensToSend("")
        }
    }

    useEffect(() => {
        const elem = document.getElementById("chat-content");
        elem.scrollTop = elem.scrollHeight;
    }, [props.mensagens])

    return(
        <div className="chat-container">
            <div style={{whiteSpace: "pre-wrap"}} id="chat-content" className="chat-content">{props.mensagens}</div>
            
            <div className="chat-form">
                <input type="text" value={mensToSend} onChange={(e) => {setMensToSend(e.target.value)}} />
                <button onClick={() => {sendMessage()}} disabled={!mensToSend.trim()} className={!mensToSend.trim() && "disabled"}>Enviar</button>
            </div>
        </div>
    )
}

export default Chat;