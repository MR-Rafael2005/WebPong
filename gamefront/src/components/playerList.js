import React from "react";

const PlayerList = (props) => {
    return(
        <div>
            {Object.keys(props.playersList).map((key) => { 
                return(
                    <div>{props.playersList[key].name}</div>
                )
            })}
        </div>
    )
}

export default PlayerList;