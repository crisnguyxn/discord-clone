import React from "react";
import './Navbar.css'
import logo from '../../image/dis.png'
import plus from '../../image/plus.png'
import explore from '../../image/explore.png'

function Navbar(props) {
  const createServer = () => {
    props.onCreateServer(true)
  }

  return (
    <div className="navbars">
        <div className="top-navbar">
          <img src={logo} alt=""/>
        </div>
        <div className="channels">
          <div className="plus">
            <img onClick={() => createServer()} src={plus} alt=""/>
          </div>
          <div className="explore">
            <img src={explore} alt=""/>
          </div>
        </div>
    </div>
  );
}
export default Navbar;
