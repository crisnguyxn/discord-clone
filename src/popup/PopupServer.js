import axios from "axios";
import "./PopupServer.css";
import { keys } from "../config/config";
import { env } from "../config/envConfig";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
function PopupServer(props) {
  const [inputValues, setinputValues] = useState({
    name: "",
    description: "",
    region: "IN",
  });
  const params = useParams();
  const closedPopup = () => {
    props.closedPopup(false);
  };
  const handleChange = (e) => {
    setinputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const colors = ["#E59866", "#2ECC71", "#48C9B0", "#E74C3C"];
      const ranInd = Math.floor(Math.random() * colors.length);
      const color = colors[ranInd];
      const tokenVal = document.cookie.split(";");
      const roomToken = tokenVal[1].split("=")[1];
      const token = tokenVal[0].split("=")[1];
      const userId = localStorage.getItem("userId");
      const data = await axios.post(
        "https://api.100ms.live/v2/rooms",
        inputValues,
        {
          headers: {
            Authorization: `Bearer ${roomToken}`,
          },
          env: env,
        }
      );
      const dataRec = await data.data;
      const resp = await axios.post(
        `${keys.BASE_URL}/rooms/create`,
        {
          dataRec,
          userId,
          backgroundColor: color,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      props.addServer(resp.data);
    } catch (error) {
      console.log(error);
    }
    closedPopup();
  };
  const createVoiceRoom = async (e) => {
    e.preventDefault();
    const data = await axios.post(`${keys.BASE_URL}/discord-rooms/create`, {
      name: inputValues.name,
      userId: localStorage.getItem("userId"),
      roomId: params.id,
    });
    props.addRoom(data.data);
    closedPopup();
  };

  return (
    <div className="popup">
      <div className="header">
        <h3>{props.isFromMainbar ? "Create Room" : "Create Server"}</h3>
        <button onClick={() => closedPopup()}>X</button>
      </div>
      <form onSubmit={!props.isFromMainbar ? handleSubmit : createVoiceRoom}>
        <div className="fields">
          <input
            placeholder={props.isFromMainbar ? "Create Room" : "Create Server"}
            value={inputValues.name}
            id="name"
            name="name"
            onChange={handleChange}
            required
          />
          {!props.isFromMainbar ? (
            <input
              placeholder="Description"
              value={inputValues.description}
              id="description"
              name="description"
              onChange={handleChange}
              required
            />
          ) : (
            ""
          )}
        </div>
        <div className="attr-fields">
          {!props.isFromMainbar ? (
            <select
              onChange={handleChange}
              name="region"
              id="region"
              defaultValue={inputValues.region}
              required
            >
              <option value="US">US</option>
              <option value="IN">IN</option>
            </select>
          ) : (
            ""
          )}
          <button>Create</button>
        </div>
      </form>
    </div>
  );
}

export default PopupServer;
