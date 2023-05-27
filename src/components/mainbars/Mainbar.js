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
import { socket } from "../../socket/socket";

function Mainbar(props) {
  const [roomId] = useContext(ServerContext);
  const [room, setRoom] = useState();
  const [peers, setPeers] = useState([]);
  const tokenVal = document.cookie.split(";");
  const token = tokenVal[0].split("=")[1];
  const [active, setActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [prevRoom, setPrevRoom] = useState("");

  const userStatus = {
    username: localStorage.getItem("username"),
    mic: true,
    headphone: true,
    online: true,
    userId: localStorage.getItem("userId"),
  };

  const toggleMic = () => {
    userStatus.mic = !userStatus.mic;
    socket.emit("userInformation", userStatus);
    const micTag = document.getElementById("contextMic");
    if (userStatus.mic) {
      return (micTag.className = "context mic");
    } else {
      micTag.classList.remove("context");
      micTag.classList.remove("mic");
    }
  };

  const toggleMute = () => {
    userStatus.headphone = !userStatus.headphone;
    socket.emit("userInformation", userStatus);
    const muteTag = document.getElementById("contextMute");
    if (userStatus.headphone) {
      return (muteTag.className = "context headphone");
    } else {
      muteTag.classList.remove("context");
      muteTag.classList.remove("headphone");
    }
  };
  socket.on("send noti", (msg) => {
    alert(msg);
  });
  const toggleOnline = () => {
    socket.emit(
      "leave room",
      localStorage.getItem("username"),
      props.channelId
    );
    setActive(false);
  };
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

  const joinRoom = (id,bool) => {
    console.log(id);
    setActive(true);
    if(bool){
      socket.emit("join-text-room", id);
    }
    socket.emit("addUser", {
      rId: id,
      userId: localStorage.getItem("userId"),
      username: localStorage.getItem("username"),
    });
    props.getChannelId(id,bool);
    setPrevRoom(id);
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

  const createRoom = (option) => {
    props.createVoiceRoom(true, option);
    props.isFromMainbar(true);
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
              <img onClick={() => createRoom("text")} src={whiteplus} alt="" />
            </div>
            <div className="list-user">
              {peers.length > 0
                ? peers.map((peer) =>
                    peer.isText ? (
                      <div
                        key={peer._id}
                        className="voice-room"
                        id="room"
                        onClick={() => joinRoom(peer._id,peer.isText)}
                      >
                        <div className="room-name">
                          <div className="channel-info">
                            <img src={dis} alt="" />
                            <p>{peer.name}</p>
                          </div>
                          <div className="user">
                            {users &&
                              users.map((user) =>
                                peer._id === user.rId ? (
                                  <div key={user.userId} className="user-join">
                                    <img src={dis} alt="" />
                                    <p>{user.username}</p>
                                  </div>
                                ) : (
                                  ""
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}
            </div>
            <div className="action-voice">
              <p>VOICE CHANNELS</p>
              <img src={whiteplus} onClick={() => createRoom("voice")} alt="" />
            </div>
            <div className="list-user">
              {peers.length > 0
                ? peers.map((peer) =>
                    peer.isText === false ? (
                      <div
                        key={peer._id}
                        className="voice-room"
                        id="room"
                        onClick={() => joinRoom(peer._id,peer.isText)}
                      >
                        <div className="room-name">
                          <div className="channel-info">
                            <img src={mic} alt="" />
                            <p>{peer.name}</p>
                          </div>
                          <div className="user">
                            {users &&
                              users.map((user) =>
                                peer._id === user.rId ? (
                                  <div key={user.userId} className="user-join">
                                    <img src={dis} alt="" />
                                    <p>{user.username}</p>
                                  </div>
                                ) : (
                                  ""
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}
            </div>
            <div id="videoGrid"></div>
          </div>
          <div className="user-infos">
            <div className="actions">
              {active ? (
                <div className="connected-line">
                  <div className="noti">
                    <img src={soundWave} alt="" /> Connected
                  </div>
                  <img src={call} onClick={() => toggleOnline()} alt="" />
                </div>
              ) : (
                " "
              )}
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
                <img src={mic} onClick={() => toggleMic()} alt="" />
                <span id="contextMic"></span>
                <img src={headphone} onClick={() => toggleMute()} alt="" />
                <span id="contextMute"></span>
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
