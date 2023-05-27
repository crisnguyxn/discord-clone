import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../image/dis.png";
import plus from "../../image/plus.png";
import explore from "../../image/explore.png";
import axios from "axios";
import { keys } from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";
import Room from "../../room/Room";

function Navbar(props) {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const params =  useParams()
  const getRooms = async () => {
    if (document.cookie) {
      const tokenVal = document.cookie.split(";");
      const token = tokenVal[0].split("=")[1];
      const servers = await axios.get(`${keys.BASE_URL}/rooms/get-rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(servers.data);
      params.id = servers.data[0]._id;
      navigate(`/rooms/room/${params.id}`)
    } else {
      alert("Please register or login first!");
      return navigate("/register");
    }
  };

  useEffect(() => {
    getRooms();
  }, [props.servers.length]);
  const createServer = () => {
    props.onCreateServer(true);
  };


  return (
    <div className="navbars">
      <div className="top-navbar">
        <img src={logo} alt="" />
        <div className="plus">
          <img src={plus} alt="" />
        </div>
        <div className="explore">
          <img src={explore} alt="" />
        </div>
      </div>
      <div className="rooms">
        {rooms.length > 0
          ? rooms.map((room) => {
              return <Room key={room._id} room={room} />;
            })
          : ""}
      </div>
    </div>
  );
}
export default Navbar;
