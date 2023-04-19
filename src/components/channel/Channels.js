import React, { useEffect, useState } from "react";
import "./Channel.css";
import axios from "axios";
import { keys } from "../../config/config";
import { socket } from "../../socket/socket";

function Channels(props) {
  const [msg, setMsg] = useState();
  const [msgList,setMsgList] = useState([])
  const [name, setName] = useState("")
  const handleChange = (e) => {
    let val = e.target.value;
    setMsg(val);
  };

  let value = {
    message: msg,
    userId: localStorage.getItem("userId"),
    roomId: props.channelId,
    username: localStorage.getItem("username"),
  };

  const handleSubmit = async (e) => {
    setMsg("")
    e.preventDefault();
    try {
      const data = await axios.post(
        `${keys.BASE_URL}/discord-rooms/message`,
        value
      );
      socket.emit('send message',data.data.data)
    } catch (error) {
      console.log(error);
    }
  };

  const getChannelInfo = async () => {
    try {
      if(props.channelId !== undefined){
        const data = await axios.get(`${keys.BASE_URL}/discord-rooms/channels/${props.channelId}`)
        setName(data.data.name)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getMessages = async () => {
    try {
      if(props.channelId !== undefined){
        const data = await axios.get(`${keys.BASE_URL}/discord-rooms/message/${props.channelId}`)
        setMsgList(data.data)
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getMessages()
    getChannelInfo()
  }, [props.channelId])
  

  socket.on('send message',msg => {
    setMsgList([...msgList,msg])
  })

  return (
    <div className="channel">
      <div className="channel-header">
        <p>{name}</p>
      </div>
      <div className="channel-main">
      {
        msgList.map(msg => (
          <div className={(msg.userId === localStorage.getItem("userId")) ? "right-outer":"left-outer"} key={msg._id}>
            <div className={(msg.userId === localStorage.getItem("userId")) ? "right":"left"}>
              <p>{msg.message}</p>
            </div>
          </div>
        ))
      }
      </div>
      <div className="channel-footer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="msg"
            value={msg}
            onChange={handleChange}
            placeholder="Send a message"
          />
        </form>
      </div>
    </div>
  );
}

export default Channels;
