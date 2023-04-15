import { selectPeers, useHMSStore } from "@100mslive/react-sdk";
import React from "react";
import Peer from "../../peers/Peer";

function Channel() {
  const peers = useHMSStore(selectPeers);
  console.log(peers);
  return (
    <div className="conference-section">
      <h2>Conference</h2>
      <div className="peers-container">
        {peers.map((peer) => (
          <Peer key={peer.id} peer={peer} />
        ))}
      </div>
    </div>
  );
}

export default Channel;
