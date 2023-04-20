import { useState } from "react";
import "./App.css";
import Mainbar from "./components/mainbars/Mainbar";
import Navbar from "./components/navbars/Navbar";
import PopupServer from "./popup/PopupServer";
import Channels from "./components/channel/Channels";
import { ServerProvider } from "./context/ServerProvider";
function App() {
  const [isShow, setIsShow] = useState(false);
  const [isFromMainbar, setIsFromMainBar] = useState(false)
  const [rooms, setRooms] = useState([]);
  const [voiceRooms, setVoiceRooms] = useState([])
  const [channelId, setChannelId] = useState()
  const [roomName, setRoomName] = useState("")
  const addServer = (room) => {
    setRooms([...rooms, room]);
  };

  const createServer = (value) => {
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

  const getChannelId = (id) => {
    setChannelId(id)
  }

  return (
    <div className="app-container">
      <div className="navbar">
        <Navbar onCreateServer={createServer} servers={rooms} />
      </div>
      <ServerProvider>
        <div className="mainbar">
          <Mainbar createVoiceRoom={createServer} isFromMainbar={getNoti} voiceRooms={voiceRooms} getChannelId={getChannelId}/>
        </div>
        <div className="channel">
          <Channels channelId={channelId} roomName={roomName} />
        </div>
      </ServerProvider>
      {isShow ? (
        <PopupServer closedPopup={closedPopup} addServer={addServer} isFromMainbar={isFromMainbar} addRoom={addRoom}/>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
