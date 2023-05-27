import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Channel.css";
import axios from "axios";
import { keys } from "../../config/config";
import { socket } from "../../socket/socket";
import moment from "moment";
import mic from "../../image/mic.png";
import camera from "../../image/camera.png";
import plus from "../../image/plus.png"
import VideoContainer from "../../video/VideoContainer";
import { useOutletContext } from "react-router-dom";

const Channels = React.memo((props) => {
  const dataList = useOutletContext();
  const inputRef = useRef()
  const [msgList, setMsgList] = useState([]);
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [isRecording, setIsRecoding] = useState(false);
  const [isVideoRec, setIsVideoRec] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isCall, setIsCall] = useState(false);
  const [joinId, setJoinId] = useState(null);

  socket.on("user-connected", (userId) => {
    setJoinId(userId);
  });

  const audioConst = {
    audio: true,
  };
  const videoConst = {
    video: { height: 400, width: 400 },
    audio: true,
  };

  const Recoding = (option) => {
    if (option === "video") {
      setIsVideoRec(true);
    } else {
      setIsRecoding(true);
    }
    getRecording(option);
  };
  const videoDep = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    mimeType: "video/webm",
  };
  const getRecording = (option) => {
    navigator.mediaDevices
      .getUserMedia(option === "video" ? videoConst : audioConst)
      .then((stream) => {
        const recordService = new MediaRecorder(
          stream,
          option === "video" ? { videoDep } : null
        );
        recordService.start();
        let chunks = [];
        const video = document.getElementById("videoPrev");
        if (option === "video") {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };
        }

        const send = document.getElementById("send");
        send.onclick = (e) => {
          recordService.stop();
          if (option === "video") {
            video.onloadedmetadata = () => {
              video.remove();
            };
            setIsVideoRec(false);
          } else {
            setIsRecoding(false);
          }
        };

        const stop = document.getElementById("stop");

        stop.onclick = (e) => {
          if (option === "video") {
            video.onloadedmetadata = () => {
              video.remove();
            };
            setAudioSrc(null);
            setIsVideoRec(false);
          } else {
            setIsRecoding(false);
          }
        };

        recordService.onstop = () => {
          const contentType = option === "video" ? "video/webm" : "audio/ogg";
          let blob = new Blob(chunks, { type: contentType });
          const fileReader = new FileReader();
          fileReader.readAsDataURL(blob);
          fileReader.onloadend = (e) => {
            const result = fileReader.result;
            if (option === "video") {
              video.src = result;
              setVideoSrc(blob);
            } else {
              setAudioSrc(result);
            }
          };
          chunks = [];
        };

        recordService.addEventListener("dataavailable", (e) => {
          chunks.push(e.data);
        });
      });
  };

  let value = {
    userId: localStorage.getItem("userId"),
    roomId: dataList[0],
    username: localStorage.getItem("username"),
    createdAt: Date.now(),
  };

  socket.on("notification", (msg) => {
    alert(msg);
  });

  const handleSubmit = async (e) => {
    console.log("runnn submit");
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("message", inputRef.current.value);
      formData.append("userId", value.userId);
      formData.append("roomId", value.roomId);
      formData.append("username", value.username);
      formData.append("createdAt", value.createdAt);
      if (audioSrc !== null) {
        formData.append("audioVoice", audioSrc);
      }
      if (videoSrc !== null) {
        formData.append("files", videoSrc);
      }
      if (
        formData.get("message") !== null ||
        formData.get("audioVoice") !== null ||
        formData.get("files") !== null ||
        formData.get("videoSrc") !== null
      ) {
        const msgUploaded = await axios.post(
          `${keys.BASE_URL}/discord-rooms/message`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        socket.emit("send message", dataList[0], msgUploaded.data);
        setAudioSrc(null);
        setVideoSrc(null);
        setFiles([]);
      } else {
        alert("send something");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getChannelInfo = async () => {
    try {
      console.log("runnn getChannel Info");
      if (dataList[0] !== undefined) {
        const data = await axios.get(
          `${keys.BASE_URL}/discord-rooms/channels/${dataList[0]}`
        );
        setName(data.data.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async () => {
    try {
      console.log("runnn get msgs");
      if (dataList[0] !== undefined) {
        const data = await axios.get(
          `${keys.BASE_URL}/discord-rooms/message/${dataList[0]}`
        );
        setMsgList(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("re-render in effect");
    if (isCall) {
      endVideo();
    }
    getMessages();
    getChannelInfo();
  }, [dataList[0]]);

  const onChange = () => {
    const files = document.querySelector("input[type=file]").files;
    setFiles(files);
  };
  socket.on("send", (msg) => {
    setMsgList([...msgList, msg]);
  });

  const call = () => {
    setIsCall(true);
    const channelDiv = document.getElementById("channel-main");
    channelDiv.classList.add("call-style");
  };

  const endVideo = () => {
    console.log("end video");
    setIsCall(false);
    const channelDiv = document.getElementById("channel-main");
    channelDiv.classList.remove("call-style");
  };
  return (
    <div className="channel">
      <div className="channel-header">
        <p>{name}</p>
        {dataList[2] === false ? (
          dataList[0] && isCall ? (
            <button onClick={() => endVideo()}>End Video</button>
          ) : (
            dataList[0] && <button onClick={() => call()}>Call Video</button>
          )
        ) : (
          ""
        )}
      </div>
      <div className="channel-main" id="channel-main">
        {isCall ? (
          <div className="video-container">
            <VideoContainer joinId={joinId} channelId={dataList[0]} />
          </div>
        ) : (
          ""
        )}
        <div className="msg-container" style={{display:'none'}}>
          {msgList.map((msg) => (
            <div
              className={
                msg.userId === localStorage.getItem("userId")
                  ? "right-outer"
                  : "left-outer"
              }
              key={msg._id}
            >
              <div
                className={
                  msg.userId === localStorage.getItem("userId")
                    ? "right"
                    : "left"
                }
              >
                <p>{msg.message}</p>
                {msg.images &&
                  msg.images.map((img) => (
                    <div key={img._id} className="image">
                      <img
                        src={
                          "data:" +
                          img.img.contentType +
                          ";base64," +
                          img.img.data
                        }
                        alt={img._id}
                        height={380}
                        width={380}
                      />
                    </div>
                  ))}
                {msg.audio && (
                  <audio controls className="audio">
                    <source src={msg.audio}></source>
                  </audio>
                )}
                {msg.videos &&
                  msg.videos.map((video) => (
                    <div key={video._id}>
                      <video controls height={380} width={380}>
                        <source
                          src={
                            "data:" +
                            video.video.contentType +
                            ";base64," +
                            video.video.data
                          }
                        ></source>
                      </video>
                    </div>
                  ))}
                <span>{moment(`${msg.createdAt}`).format("lll")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="channel-footer">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {isRecording ? (
            <div className="record-field">
              <p>Recording...</p>
              <label id="stop">X</label>
              <label id="send">OK</label>
            </div>
          ) : (
            ""
          )}
          {isVideoRec ? (
            <div className="video-field">
              <video id="videoPrev"></video>
              <label id="stop">X</label>
              <label id="send">OK</label>
            </div>
          ) : (
            ""
          )}
          <div className="input-field">
            <input
              type="text"
              name="msg"
              ref={inputRef}
              placeholder="Send a message"
            />
            <label htmlFor="files">
              <img src={plus} alt=""/>  
              <input
                id="files"
                type="file"
                name="files"
                multiple
                onChange={onChange}
              />
            </label>
            <label onClick={() => Recoding("audio")}>
              <img src={mic} alt="" />
            </label>
            <label onClick={() => Recoding("video")}>
              <img src={camera} alt="" />
            </label>
          </div>
        </form>
      </div>
    </div>
  );
});
export default React.memo(Channels);
