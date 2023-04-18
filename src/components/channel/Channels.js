import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { keys } from "../../config/config";
import { ServerContext } from "../../context/ServerProvider";
import Channel from "./Channel";

function Channels() {
  const [singleRoom, setSingleRoom] = useState();
  const [roomId, setRoomId] = useContext(ServerContext);
  return (
    <>
      {roomId !== undefined ? (
        <div className="conference-section">
          <h2>Conference</h2>
          <Channel channel={singleRoom}/>
        </div>
      ) : (
        <div className="conference-section">
            <h2>No connect to any room</h2>
        </div>
      )}
    </>
  );
}

export default Channels;
