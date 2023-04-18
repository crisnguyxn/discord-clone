import React from "react";
import logo from "../../src/image/dis.png";
import "./Room.css";
import { Link } from "react-router-dom";
function Room({ room }) {


  return (
    <div className="room">
      <Link className="style-link" to={`/rooms/room/${room._id}`}>
        <div className="server">
          <img src={logo} alt="" style={{ backgroundColor: `${room.backgroundColor}` }} />
          <span className="tooltiptext">{room.name}</span>
        </div>
      </Link>
    </div>
  );
}

export default Room;
