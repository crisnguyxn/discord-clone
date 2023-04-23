import React, { useEffect, useState } from "react";
import "./Channel.css";
import axios from "axios";
import { keys } from "../../config/config";
import { socket } from "../../socket/socket";
import moment from "moment";

function Channels(props) {
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [name, setName] = useState("");
  const [showImg, setShowImg] = useState(false);
  const [files, setFiles] = useState([]);
  const [imgs, setImgs] = useState([]);
  const handleChange = (e) => {
    let val = e.target.value;
    setMsg(val);
  };

  let value = {
    message: msg,
    userId: localStorage.getItem("userId"),
    roomId: props.channelId,
    username: localStorage.getItem("username"),
    createdAt: Date.now(),
  };

  socket.on("notification", (msg) => {
    alert(msg);
  });

  const handleSubmit = async (e) => {
    setMsg("");
    e.preventDefault();
    setShowImg(false);
    try {
      const data = await axios.post(
        `${keys.BASE_URL}/discord-rooms/message`,
        value
      );
      socket.emit("send message", props.channelId, data.data.data);
      if (data) {
        files.forEach(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const msgId = data.data.data._id;
          formData.append("msgId", msgId);
          const imgUploaded = await axios.post(
            `${keys.BASE_URL}/upload-files`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(imgUploaded);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getChannelInfo = async () => {
    try {
      if (props.channelId !== undefined) {
        const data = await axios.get(
          `${keys.BASE_URL}/discord-rooms/channels/${props.channelId}`
        );
        setName(data.data.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async () => {
    try {
      if (props.channelId !== undefined) {
        const data = await axios.get(
          `${keys.BASE_URL}/discord-rooms/message/${props.channelId}`
        );
        setMsgList(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMessages();
    getChannelInfo();
  }, [props.channelId]);
  const reader = new FileReader();
  const readFile = (file) => {
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      setFiles([...files, file]);
      let id = 0;
      reader.addEventListener(
        "load",
        () => {
          let img = {
            src: reader.result,
            id: id++,
          };
          setImgs([...imgs, img]);
        },
        false
      );
      reader.readAsDataURL(file);
    }
  };
  const previewFile = (e) => {
    let files = document.querySelector("input[type=file]").files;
    const form = document.querySelector("form");
    form.classList.add("new-form-style");
    if (files) {
      setShowImg(true);
      Array.prototype.forEach.call(files, readFile);
    }
  };
  socket.on("send message", (msg) => {
    setMsgList([...msgList, msg]);
  });

  return (
    <div className="channel">
      <div className="channel-header">
        <p>{name}</p>
      </div>
      <div className="channel-main" id="channel-main">
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
                msg.userId === localStorage.getItem("userId") ? "right" : "left"
              }
            >
              <p>{msg.message}</p>
              <span>{moment(`${msg.createdAt}`).format("lll")}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="channel-footer">
        <form onSubmit={handleSubmit}>
          {showImg ? (
            <div className="list-img">
              {imgs.map((img) => (
                <div key={img.imgKey}>
                  <img src={img.src} alt="" height={400} width={400} />
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
          <div className="input-field">
            <input
              type="text"
              name="msg"
              value={msg}
              onChange={handleChange}
              placeholder="Send a message"
            />
            <label htmlFor="file">
              +
              <input id="file" type="file" name="file" onChange={previewFile} />
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Channels;
