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

  const toggleOnline = () => {
    userStatus.online = !userStatus.online;
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
  const joinRoom = (id) => {
    userStatus.online = !userStatus.online;
    socket.emit("userInformation", userStatus);
    mainFunction(1000);
    props.getChannelId(id);
  };
  const mainFunction = (time) => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      let mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setActive(mediaRecorder.stream.active);
      console.log(mediaRecorder);
      var audioChunk = [];
      mediaRecorder.addEventListener("dataavailable", function (event) {
        audioChunk.push(event.data);
      });
      mediaRecorder.addEventListener("stop", () => {
        let audioBlob = new Blob(audioChunk);
        audioChunk = [];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(audioBlob);
        fileReader.onloadend = () => {
          let base64String = fileReader.result;
          socket.emit("voice", base64String);
        };

        mediaRecorder.start();

        setTimeout(() => {
          mediaRecorder.stop();
        }, time);
      });
      setTimeout(() => {
        mediaRecorder.stop();
      }, time);
    });
    socket.on("send", (data) => {
      let audio = new Audio(data);
      audio.play();
    });

    socket.on("userUpdated", (data) => {
      console.log(data);
    });
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
                <img onClick={() => toggleMute()} src={headphone} alt="" />
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
