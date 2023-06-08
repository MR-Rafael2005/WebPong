import {createGlobalStyle} from "styled-components";


const GlobalStyle = createGlobalStyle`

body{
    background-color: #f0f0f0;
    padding: 5vh;
}

button{
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    background-color: rgb(90, 120, 240);
    padding: 8px;
    cursor: pointer;
}

button.disabled{
    background-color: rgb(140, 160, 255);
    color: rgb(114,114,114);
}

input{
    font-size: 16px;
    padding: 8px;
    border: none;
    border-bottom: solid 1px rgb(90, 120, 240);
    outline: none;
    flex: 1;
}

//app.js
.main-container{
    margin: 30px;
}

//Pong.js
.list-container{
    margin-right: 30px;
    padding: 10px;
    background-color: #fff;
    max-width: 40vh;
    width: 40vh;
}

//roomsList.js, playerList.js
.list-item{
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px #f0f0f0;
    align-items: center;
    padding-top: 6px;
    padding-bottom: 6px;
}

//playerList.js, roomsList.js
.list-title{
    color: rgb(40, 60, 140);
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

//roomsList.js
.list-group{
    margin-bottom: 20px;
}

//chat.js
.chat-container{
    background-color: #fff;
    padding: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.chat-form{
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.chat-content{
    white-space: pre-wrap;
    overflow: auto;
    height: calc(100vh - 120px);

}

//game.js
.game-message {
    position: absolute;
    width: 300px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    text-align: center;
    left: 120px;
    top: 60px;
}

`

export default GlobalStyle;