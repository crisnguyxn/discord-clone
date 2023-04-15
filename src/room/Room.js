import React from "react";
import logo from "../../src/image/dis.png";
import {useHMSActions} from "@100mslive/react-sdk";
import "./Room.css";
import axios from "axios";
function Room({ room }) {
  if (document.cookie) {
    const tokenVal = document.cookie.split(";");
    var roomToken = tokenVal[1].split("=")[1];
  }
  const hmsActions = useHMSActions()
  const joinRoom = async () => {
    const roomCodes = await axios.post(
      `https://api.100ms.live/v2/room-codes/room/${room.id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${roomToken}`,
        },
      }
    );
    const data = roomCodes.data.data;
    if(room.userId === localStorage.getItem("userId")){
        const authToken = await hmsActions.getAuthTokenByRoomCode({
            roomCode: data[1].code
        })
        try {
            await hmsActions.join({
                userName:localStorage.getItem("username"),
                authToken
            })
        } catch (error) {
            console.log(error);
        }
    }else{
        const authToken = await hmsActions.getAuthTokenByRoomCode({
            roomCode:data[0].code
        })
        try {
            await hmsActions.join({
                userName:localStorage.getItem("username"),
                authToken
            })
        } catch (error) {
            console.log(error);
        }
    }
  };

  return (
    <div onClick={() => joinRoom()} className="room">
      <img src={logo} alt="" />
      <p>{room.name}</p>
    </div>
  );
}

export default Room;
