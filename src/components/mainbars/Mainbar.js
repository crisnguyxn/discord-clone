import { React, useContext, useEffect, useState } from "react";
import "./Mainbar.css";
import { ServerContext } from "../../context/ServerProvider";
import axios from "axios";
import { keys } from "../../config/config";
import down from "../../image/down.png";
import hash from "../../image/hash.png";
import settings from "../../image/settings.png";
import whiteplus from "../../image/pluswhite.png";
import dis from "../../image/dis.png";

function Mainbar() {
  const [roomId, setRoomId] = useContext(ServerContext);
  const [room, setRoom] = useState();
  const [peers, setPeers] = useState([]);
  const tokenVal = document.cookie.split(";");
  const roomToken = tokenVal[1].split("=")[1];
  const token = tokenVal[0].split("=")[1];

  const getRoom = async () => {
    if (roomId !== undefined) {
      const data = await axios.get(`${keys.BASE_URL}/rooms/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoom(data.data.room);
    }
  };

  useEffect(() => {
    getRoom();
  }, [roomId]);
  return (
    <div className="mainbar">
      {room !== undefined ? (
        <div className="main">
          <div className="main-header">
            <p>{room.name}</p>
            <img src={down} alt="" />
          </div>
          <div className="main-action">
            <div className="action-voice">
              <p>TEXT CHANNELS</p>
              <img src={whiteplus} alt="" />
            </div>
            <div className="list-user">
              {peers.length > 0
                ? peers.map((peer) => (
                    <div className="voice-room">
                      <div className="room-name">
                        <img src={dis} alt="" />
                        <p>{peer.name}</p>
                      </div>
                    </div>
                  ))
                : ""}
            </div>
            <div className="action-voice">
              <p>VOICE CHANNELS</p>
              <img src={whiteplus} alt="" />
            </div>
            <div className="voice-room">
              <div className="room-name">
                <img src={hash} alt="" />
                <p>General</p>
              </div>
              <div className="settings">
                <img src={settings} alt="" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Mainbar;
