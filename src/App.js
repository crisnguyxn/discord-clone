import { useState } from 'react';
import './App.css';
import Mainbar from './components/mainbars/Mainbar';
import Navbar from './components/navbars/Navbar';
import PopupServer from './popup/PopupServer';
import Channel from './components/channel/Channel';
function App() {

  const [isShow, setIsShow] = useState(false)

  const [rooms, setRooms] = useState([])

  const addServer = (room) => {
    setRooms([...rooms,room])
  }

  const createServer = (val) => {
    setIsShow(val)
  }

  const closedPopup = (bool) => {
    setIsShow(bool)
  }

  return (
    <div className="app-container">
      <div className='navbar'>
        <Navbar onCreateServer= {createServer}/>
      </div>
      <div className='mainbar'>
        <Mainbar rooms={rooms}/>
      </div>
      <div className='channel'>
        <Channel/>
      </div>
      {
        isShow ? <PopupServer closedPopup={closedPopup} addServer={addServer} /> : ""
      }
    </div>
  );
}

export default App;
