import { useState } from "react";
import "./App.css";
import Mainbar from "./components/mainbars/Mainbar";
import Navbar from "./components/navbars/Navbar";
import PopupServer from "./popup/PopupServer";
import Channels from "./components/channel/Channels";
import { ServerProvider } from "./context/ServerProvider";
function App() {
  const [isShow, setIsShow] = useState(false);

  const [rooms, setRooms] = useState([]);

  const addServer = (room) => {
    setRooms([...rooms, room]);
  };

  const createServer = (val) => {
    setIsShow(val);
  };

  const closedPopup = (bool) => {
    setIsShow(bool);
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <Navbar onCreateServer={createServer} servers={rooms} />
      </div>
      <ServerProvider>
        <div className="mainbar">
          <Mainbar/>
        </div>
        <div className="channel">
          <Channels />
        </div>
      </ServerProvider>
      {isShow ? (
        <PopupServer closedPopup={closedPopup} addServer={addServer} />
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
