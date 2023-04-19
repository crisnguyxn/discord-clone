import React from "react";
import './Channel.css'

function Channels() {
  return (
    <div className="channel">
      <div className="channel-header">
        <h3>check it</h3>
      </div>
      <div className="channel-main">
        <h3>hihi</h3>
      </div>
      <div className="channel-footer">
        <form>
          <input type="text" placeholder="Send a message"/>
        </form>
      </div>
    </div>
  );
}

export default Channels;
