import { useState } from "react";
import "./App.css";
import Mainbar from "./components/mainbars/Mainbar";
import Navbar from "./components/navbars/Navbar";
import PopupServer from "./popup/PopupServer";
import Channels from "./components/channel/Channels";
import { ServerProvider } from "./context/ServerProvider";
import { Outlet } from "react-router-dom";
function App() {
  const [isShow, setIsShow] = useState(false);
  const [isFromMainbar, setIsFromMainBar] = useState(false)
  const [rooms, setRooms] = useState([]);
  const [voiceRooms, setVoiceRooms] = useState([])
  const [channelId, setChannelId] = useState()
  const [roomName, setRoomName] = useState("")
  const [type, setType] = useState("")
  const [isText, setIsText] = useState(false)

  const addServer = (room) => {
    setRooms([...rooms, room]);
  };

  const createServer = (value,option) => {
    setType(option)
    setIsShow(value);
  };

  const closedPopup = (val) => {
    setIsFromMainBar(!isFromMainbar)
    setIsShow(val);
  };

  const getNoti = (bool) => {
    setIsFromMainBar(bool)
  }
  const addRoom = (data) => {
    setVoiceRooms([...voiceRooms,data])
  }

  const getChannelId = (id,bool) => {
    setIsText(bool)
    setChannelId(id)
  }
  return (
    <div className="app-container">
      <div className="navbar">
        <Navbar onCreateServer={createServer} servers={rooms} />
      </div>
      <ServerProvider>
        <div className="mainbar">
          <Mainbar createVoiceRoom={createServer} isFromMainbar={getNoti} voiceRooms={voiceRooms} getChannelId={getChannelId} channelId={channelId}/>
        </div>
        <div className="channel">
          <Outlet context={[channelId,roomName,isText]} />
        </div>
        </ServerProvider>
      {isShow ? (
        <PopupServer closedPopup={closedPopup} addServer={addServer} isFromMainbar={isFromMainbar} addRoom={addRoom} type={type}/>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
