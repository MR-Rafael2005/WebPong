import React from "react";

const PlayerList = (props) => {
    return(
        <div>
            <span className="list-title">Jogadores:</span>
            {Object.keys(props.playersList).map((key) => { 
                return(
                    <div className="list-item">{props.playersList[key].name}</div>
                )
            })}
        </div>
    )
}

export default PlayerList;