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
import mic from "../../image/mic.png";
import headphone from "../../image/headphone.png";
import share from "../../image/share.png";
import videoCamera from "../../image/video-camera.png";
import soundWave from "../../image/sound-waves.png";
import startup from "../../image/startup.png";
import music from "../../image/music.png";
import call from "../../image/call.png";
import io from 'socket.io-client'
function Mainbar(props) {
  const [roomId] = useContext(ServerContext);
  const [room, setRoom] = useState();
  const [peers, setPeers] = useState([]);
  const tokenVal = document.cookie.split(";");
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

  const getVoiceRoom = async () => {
    const data = await axios.get(`${keys.BASE_URL}/discord-rooms/${roomId}`);
    setPeers(data.data);
  };
  useEffect(() => {
    getVoiceRoom();
  }, [roomId, props.voiceRooms.length]);

  useEffect(() => {
    getRoom();
  }, [roomId]);

  const createRoom = () => {
    props.createVoiceRoom(true);
    props.isFromMainbar(true);
  };
  const joinRoom = (roomID) => {
    const newSocket = io('http://localhost:4000')
    console.log(newSocket);
  };
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
              <img onClick={() => createRoom()} src={whiteplus} alt="" />
            </div>
            <div className="list-user">
              {peers.length > 0
                ? peers.map((peer) => (
                    <div
                      key={peer._id}
                      className="voice-room"
                      onClick={() => joinRoom(peer._id)}
                    >
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
            <div id="videoGrid"></div>
          </div>
          <div className="user-infos">
            <div className="actions">
              <div className="connected-line">
                <div className="noti">
                  <img src={soundWave} alt="" /> Connected
                </div>
                <img src={call} alt="" />
              </div>
              <div className="action">
                <img src={videoCamera} alt="" />
                <img src={share} alt="" />
                <img src={startup} alt="" />
                <img src={music} alt="" />
              </div>
            </div>
            <div className="user-info">
              <div className="info-left">
                <img src={dis} alt="" />
                <p>{localStorage.getItem("username")}</p>
              </div>
              <div className="info-right">
                <img src={mic} alt="" />
                <img src={headphone} alt="" />
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
