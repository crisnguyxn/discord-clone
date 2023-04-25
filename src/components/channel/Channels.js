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
  const [files, setFiles] = useState([]);
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
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("message", value.message);
      formData.append("userId", value.userId);
      formData.append("roomId", value.roomId);
      formData.append("username", value.username);
      formData.append("createdAt", value.createdAt);
      const msgUploaded = await axios.post(
        `${keys.BASE_URL}/discord-rooms/message`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      socket.emit("send message", props.channelId, msgUploaded.data);
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

  const onChange = () => {
    const files = document.querySelector("input[type=file]").files;
    setFiles(files);
  };
  socket.on("send", (msg) => {
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
                      alt={img.img._id}
                      height={380}
                      width={380}
                    />
                  </div>
                ))}
              <span>{moment(`${msg.createdAt}`).format("lll")}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="channel-footer">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="input-field">
            <input
              type="text"
              name="msg"
              value={msg}
              onChange={handleChange}
              placeholder="Send a message"
            />
            <label htmlFor="files">
              +
              <input
                id="files"
                type="file"
                name="files"
                multiple
                onChange={onChange}
              />
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Channels;
