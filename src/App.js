import { useState } from "react";
import "./App.css";
import Mainbar from "./components/mainbars/Mainbar";
import Navbar from "./components/navbars/Navbar";
import PopupServer from "./popup/PopupServer";
import Channels from "./components/channel/Channels";
import { ServerProvider } from "./context/ServerProvider";
import { socket } from "./socket/socket";
function App() {
  console.log(socket);
  const [isShow, setIsShow] = useState(false);
  const [isFromMainbar, setIsFromMainBar] = useState(false)
  const [rooms, setRooms] = useState([]);
  const [voiceRooms, setVoiceRooms] = useState([])
  const addServer = (room) => {
    setRooms([...rooms, room]);
  };

  const createServer = (value) => {
    console.log(value);
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

  return (
    <div className="app-container">
      {/* <div className="navbar">
        <Navbar onCreateServer={createServer} servers={rooms} />
      </div>
      <ServerProvider>
        <div className="mainbar">
          <Mainbar createVoiceRoom={createServer} isFromMainbar={getNoti} voiceRooms={voiceRooms}/>
        </div>
        <div className="channel">
          <Channels />
        </div>
      </ServerProvider>
      {isShow ? (
        <PopupServer closedPopup={closedPopup} addServer={addServer} isFromMainbar={isFromMainbar} addRoom={addRoom}/>
      ) : (
        ""
      )} */}
      <h3>hi</h3>
    </div>
  );
}

export default App;
